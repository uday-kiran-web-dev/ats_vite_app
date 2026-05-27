import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-200">
      <div className="mx-auto flex max-w-screen-2xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-sm">© 2026 ATS. All rights reserved.</p>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <Link to="/" className="hover:text-white">
            Jobs
          </Link>
          <a href="#" className="hover:text-white">
            Help
          </a>
          <a href="#" className="hover:text-white">
            Privacy
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
