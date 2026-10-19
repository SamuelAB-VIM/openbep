// Languages of the "Why OpenBEP" page. To add one, translate why/index.html
// into why/<code>/index.html and add a line here; every page's switcher updates.
const OPENBEP_WHY_LANGUAGES = [
  { code: "en", name: "English", path: "" },
  { code: "fr", name: "Français", path: "fr/" },
];

(function () {
  const list = document.querySelector("[data-lang-switcher]");
  if (!list) return;
  const current = document.documentElement.lang;
  const root = list.getAttribute("data-root"); // relative path back to why/
  list.textContent = "";
  for (const l of OPENBEP_WHY_LANGUAGES) {
    const li = document.createElement("li");
    const el = document.createElement(l.code === current ? "span" : "a");
    el.textContent = l.name;
    el.lang = l.code;
    if (l.code !== current) {
      el.href = root + l.path;
      el.hreflang = l.code;
    } else {
      el.setAttribute("aria-current", "page");
    }
    li.appendChild(el);
    list.appendChild(li);
  }
})();
