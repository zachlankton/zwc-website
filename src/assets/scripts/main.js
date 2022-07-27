(function () {
  const mobileSidebarBtn = document.getElementById("mobile-sidebar-btn");
  const sidebar = document.getElementById("sidebar");

  mobileSidebarBtn.addEventListener("click", toggle_sidebar);
  function sidebarOpenClickListener(ev) {
    if (ev.target.matches("#sidebar a")) toggle_sidebar(ev);
    if (ev.target.matches("#sidebar *")) return;
    toggle_sidebar(ev);
  }

  function toggle_sidebar(ev) {
    ev.stopPropagation();
    const btn = mobileSidebarBtn;

    if (sidebar.classList.contains("open")) {
      btn.style.display = "";
      document.removeEventListener("click", sidebarOpenClickListener);
      sidebar.classList.remove("open");
      setTimeout(() => {
        sidebar.classList.remove("mobile");
      }, 200);
    } else {
      btn.style.display = "none";
      document.addEventListener("click", sidebarOpenClickListener);
      sidebar.classList.add("mobile");
      setTimeout(() => {
        sidebar.classList.add("open");
      }, 10);
    }
  }
})();
