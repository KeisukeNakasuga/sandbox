const vPath = './videos/big_buck_bunny_1080p.mp4';

Bun.serve({
  port: 3001,
  fetch(req) {
    const url = new URL(req.url);
    if (url.pathname !== "/videos/1") {
      return new Response("Not Found", { status: 404 });
    }

    const file = Bun.file(vPath);
    const range = req.headers.get("range");

    if (!range) {
      return new Response(file);
    }

    const [startStr, endStr] = range.replace("bytes=", "").split("-");
    if (startStr === undefined || endStr === undefined) {
      throw new Error('start/end is undefined');
    }
    const start = parseInt(startStr, 10);
    const end = parseInt(endStr, 10);

    return new Response(file.slice(start, end + 1), { status: 206 });
  },
});

console.log("video server listening on :3001");
