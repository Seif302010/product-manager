const router_template = (
  router,
  get = { request: null, middlewares: [] },
  post = { request: null, middlewares: [] },
  put = { request: null, middlewares: [] },
  del = { request: null, middlewares: [] }
) => {
  if (get.request) router.get("/", [...(get.middlewares || [])], get.request);
  if (post.request)
    router.post("/", [...(post.middlewares || [])], post.request);
  if (put.request) router.put("/", [...(put.middlewares || [])], put.request);
  if (del.request)
    router.delete("/", [...(del.middlewares || [])], del.request);
};

module.exports = { router_template };
