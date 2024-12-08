// save in dynamic Cache
function updateDynamicCache(dynamicCache, req, res) {
  if (res.ok) {
    return caches.open(dynamicCache).then((cache) => {
      //store in cache the request
      cache.put(req, res.clone());
      return res.clone();
    });
  } else {
    return res;
  }
}
