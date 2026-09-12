import { firebaseConfig, COUPLE_ID } from './firebase-config.js';
import { getApp, getApps, initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js';
import { collection, getFirestore } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-storage.js';

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
/**
 * The app uses the existing Firebase email/password sign-in. There is no
 * separate Firestore membership document or UID setup step.
 */
async function assertCoupleMember(user) {
  if (!user) throw new Error('Please sign in to open the diary.');
  return {};
}

function coupleCollection(name) {
  return collection(db, 'couples', COUPLE_ID, name);
}

function coupleStorageRef(...segments) {
  return ref(storage, ['couples', COUPLE_ID, ...segments].join('/'));
}

function memberName(couple, user) {
  const configuredName = couple?.memberNames?.[user?.uid];
  return String(configuredName || user?.displayName || 'Partner').trim().slice(0, 60);
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function showToast(message, type = 'success') {
  let region = document.getElementById('app-toast-region');
  if (!region) {
    region = document.createElement('div');
    region.id = 'app-toast-region';
    region.setAttribute('aria-live', 'polite');
    region.style.cssText = 'position:fixed;top:18px;right:18px;z-index:5000;display:grid;gap:10px;max-width:min(360px,calc(100vw - 36px));';
    document.body.appendChild(region);
  }

  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.cssText = `padding:13px 16px;border-radius:12px;color:#fff;box-shadow:0 8px 24px rgba(0,0,0,.2);font-family:system-ui,sans-serif;background:${type === 'error' ? '#b42318' : '#2e7d32'};`;
  region.appendChild(toast);
  window.setTimeout(() => toast.remove(), 4200);
}

// Rich text is limited to a deliberately small, attribute-free allow-list.
// This keeps the editor pleasant without permitting stored scripts or links.
function sanitizeRichText(value = '') {
  const template = document.createElement('template');
  template.innerHTML = String(value);
  const allowed = new Set(['B', 'STRONG', 'I', 'EM', 'U', 'UL', 'OL', 'LI', 'BR', 'P', 'DIV']);
  const output = document.createElement('div');

  function copyChildren(source, destination) {
    [...source.childNodes].forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        destination.appendChild(document.createTextNode(node.textContent));
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        if (allowed.has(node.tagName)) {
          const safe = document.createElement(node.tagName.toLowerCase());
          copyChildren(node, safe);
          destination.appendChild(safe);
        } else {
          copyChildren(node, destination);
        }
      }
    });
  }

  copyChildren(template.content, output);
  return output.innerHTML;
}

function validateMediaFile(file, { allowAudio = false } = {}) {
  if (!file) return 'Choose a file first.';
  const validType = file.type.startsWith('image/') || file.type.startsWith('video/') || (allowAudio && file.type.startsWith('audio/'));
  if (!validType) return 'Choose an image, video, or supported media file.';
  const limit = file.type.startsWith('video/') ? 100 : 20;
  if (file.size > limit * 1024 * 1024) return `${file.type.startsWith('video/') ? 'Videos' : 'Files'} must be smaller than ${limit} MB.`;
  return null;
}

async function compressImageForUpload(file, maxDimension = 1920, quality = 0.82) {
  if (!file?.type.startsWith('image/') || file.type === 'image/gif' || file.type === 'image/svg+xml') return file;
  try {
    const image = await createImageBitmap(file);
    const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(image.width * scale);
    canvas.height = Math.round(image.height * scale);
    canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
    image.close?.();
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/webp', quality));
    return blob && blob.size < file.size
      ? new File([blob], `${file.name.replace(/\.[^.]+$/, '') || 'image'}.webp`, { type: 'image/webp' })
      : file;
  } catch {
    return file;
  }
}

async function uploadMediaWithProgress(file, pathSegments, onProgress) {
  const task = uploadBytesResumable(coupleStorageRef(...pathSegments), file, {
    contentType: file.type || 'application/octet-stream'
  });

  return new Promise((resolve, reject) => {
    task.on('state_changed',
      snapshot => onProgress?.(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)),
      reject,
      async () => {
        try {
          resolve(await getDownloadURL(task.snapshot.ref));
        } catch (error) {
          reject(error);
        }
      }
    );
  });
}

export {
  app,
  auth,
  db,
  storage,
  COUPLE_ID,
  assertCoupleMember,
  coupleCollection,
  coupleStorageRef,
  memberName,
  escapeHtml,
  sanitizeRichText,
  showToast,
  validateMediaFile,
  compressImageForUpload,
  uploadMediaWithProgress
};
