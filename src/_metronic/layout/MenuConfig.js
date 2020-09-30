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
        icon: "flaticon2-user-outline-symbol",
        page: "partners",
        bullet: "dot",
        roles: ["Super_admin"]
      },
      {
        title: "Referral Program",
        root: false,
        icon: "flaticon2-cardiogram",
        page: "referalProgram",
        bullet: "dot"
      },
      {
        title: "Reward",
        root: false,
        icon: "flaticon-medal",
        page: "reward",
        bullet: "dot"
      },
      {
        title: "Order",
        root: false,
        icon: "flaticon2-shopping-cart-1",
        page: "order",
        bullet: "dot"
      },
    ]
  }
};
