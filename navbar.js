// Create the navbar HTML
const navbarHTML = `
<nav class="navbar">
  <div class="nav-container">
    <div class="logo">Tinaska's World</div>
    
    <div class="menu-toggle" id="menu-toggle">
      <span></span>
      <span></span>
      <span></span>
    </div>
    
    <div class="nav-links" id="nav-links">
      <a href="diary.html">📖 Memories</a>
      <a href="journey.html">⏳ Timeline</a>
      <a href="galery.html">📸 Gallery</a>
      <a href="SCHEDULE.HTML">💑 Schedules</a>
      <a href="letters.html">💌 Letters</a>
      <a href="countdown.html">⏰ Countdown</a>
      <a href="wheel.html">🎡 Idea Wheel</a>
    </div>
  </div>
</nav>

<style>
  .navbar {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    padding: 15px 20px;
    box-shadow: 0 2px 20px rgba(0,0,0,0.1);
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1000;
  }

  .nav-container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo {
    font-family: 'Dancing Script', cursive;
    font-size: 2em;
    font-weight: bold;
    color: #764ba2;
  }

  .nav-links {
    display: flex;
    gap: 30px;
    transition: all 0.3s ease;
  }

  .nav-links a {
    text-decoration: none;
    color: #333;
    font-weight: 500;
    padding: 8px 16px;
    border-radius: 20px;
    transition: all 0.3s ease;
    font-family: 'Patrick Hand', cursive;
  }

  .nav-links a:hover, .nav-links a.active {
    background: #764ba2;
    color: white;
  }

  .menu-toggle {
    display: none;
    flex-direction: column;
    cursor: pointer;
    gap: 5px;
  }

  .menu-toggle span {
    width: 25px;
    height: 3px;
    background: #764ba2;
    border-radius: 2px;
    transition: all 0.3s ease;
  }

  @media (max-width: 768px) {
    .menu-toggle {
      display: flex;
    }

    .nav-links {
      position: absolute;
      top: 70px;
      right: 20px;
      background: rgba(255, 255, 255, 0.98);
      flex-direction: column;
      gap: 15px;
      padding: 20px;
      border-radius: 15px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      display: none;
    }

    .nav-links.active {
      display: flex;
    }

    .nav-links a {
      text-align: center;
    }
  }

  .menu-toggle.active span:nth-child(1) {
    transform: rotate(45deg) translateY(8px);
  }
  .menu-toggle.active span:nth-child(2) {
    opacity: 0;
  }
  .menu-toggle.active span:nth-child(3) {
    transform: rotate(-45deg) translateY(-8px);
  }
</style>
`;

// Insert navbar at the top of the body
document.body.insertAdjacentHTML("afterbegin", navbarHTML);

// Adjust body padding to account for the fixed navbar height so page headers aren't hidden
function adjustBodyPaddingForNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  // Use offsetHeight which includes padding
  const navHeight = navbar.offsetHeight;
  // Apply padding-top to body so content starts below the navbar
  document.body.style.paddingTop = navHeight + 'px';
}

// Run on load and when the window is resized (to handle responsive navbar height)
window.addEventListener('load', adjustBodyPaddingForNavbar);
window.addEventListener('resize', adjustBodyPaddingForNavbar);

// Activate the hamburger menu toggle
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");
  const links = document.querySelectorAll(".nav-links a");

  // Highlight active link automatically
  links.forEach(link => {
    if (link.href === window.location.href) {
      link.classList.add("active");
    }
  });

  // Toggle menu open/close
  menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("active");
    navLinks.classList.toggle("active");
  });
});
