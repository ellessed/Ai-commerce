import logo from "../../assets/logo.png";
import "../Footer/footer.css";

const Footer = () => {
  return (
    <div className="footer">
      Copyright Arty Intelligence &copy; {new Date().getFullYear()}

      <ul class="social-media-list">
  <li>
    <a href="https://www.instagram.com/your-username" target="_blank">
      <i class="fab fa-instagram"></i>
      Instagram
    </a>
  </li>
  <li>
    <a href="https://twitter.com/your-username" target="_blank">
      <i class="fab fa-twitter"></i>
      Twitter
    </a>
  </li>
  <li>
    <a href="https://www.facebook.com/your-username" target="_blank">
      <i class="fab fa-facebook"></i>
      Facebook
    </a>
  </li>
  <li>
    <a href="https://github.com/your-username" target="_blank">
      <i class="fab fa-github"></i>
      GitHub
    </a>
  </li>
</ul>

      </div>
  );
};

export default Footer;
