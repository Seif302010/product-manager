const router_template = (
  router,
  get_req = null,
  post_req = null,
  put_req = null,
  delete_req = null
) => {
  if (get_req != null) router.get("/", get_req);
  if (post_req != null) router.post("/", post_req);
  if (put_req != null) router.put("/", put_req);
  if (delete_req != null) router.delete("/", delete_req);
};
module.exports = { router_template };
