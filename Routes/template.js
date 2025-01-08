const registerRoutes = (router, method, routes) => {
  routes.forEach(({ path = "/", request = null, middlewares = [] }) => {
    if (request) {
      router[method](`${path}`, [...middlewares], request);
    }
  });
};

const router_template = (router, get = [], post = [], put = [], del = []) => {
  registerRoutes(router, "get", get);
  registerRoutes(router, "post", post);
  registerRoutes(router, "put", put);
  registerRoutes(router, "delete", del);
};

module.exports = { router_template };
