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

  window.addEventListener("load", () => {
    var c = document.createElement("canvas");
    c.width = "40";
    c.height = "40";
    var ctx = c.getContext("2d");
    var img = document.getElementById("header-icon");
    ctx.drawImage(img, 4, 4);

    let backgroundImage = [
      `background-image: url(${c.toDataURL()})`,
      "color: black",
      "padding: 50px",
      "font-weight: bolder",
      "font-size: 30px",
      "-webkit-text-stroke-width: 1px",
      "-webkit-text-stroke-color: yellow",
      "text-transform: uppercase",
      "text-align: center",
      "letter-spacing: 1px",
    ].join(" ;");

    console.log("%cWelcome, Curious Human!", backgroundImage);
  });
})();
