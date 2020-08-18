export default {
  header: {
    self: {},
    items: [
      {
        title: "Dashboards",
        root: true,
        alignment: "left",
        page: "dashboard",
        translate: "MENU.DASHBOARD"
      },
    ]
  },
  aside: {
    self: {},
    items: [
      {
        title: "Dashboard",
        root: true,
        icon: "flaticon2-architecture-and-city",
        page: "dashboard",
        translate: "MENU.DASHBOARD",
        bullet: "dot"
      },
      {
        title: "Partners",
        root: false,
        icon: "flaticon2-architecture-and-city",
        page: "partners",
        bullet: "dot"
      },
      {
        title: "Referral Program",
        root: false,
        icon: "flaticon2-architecture-and-city",
        page: "referalProgram",
        bullet: "dot"
      },
    ]
  }
};
