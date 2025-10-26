async function uploadFileWithFetch(
  file: File,
  onProgress: (percent: number) => void
) {
  const total = file.size;
  let uploaded = 0;

  // Tạo stream để đọc file và theo dõi tiến trình
  const stream = new ReadableStream({
    async start(controller) {
      const reader = file.stream().getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        uploaded += value.length;
        onProgress(Math.round((uploaded / total) * 100)); // callback tiến trình
        controller.enqueue(value);
      }
      controller.close();
    },
  });

  // Gửi stream qua fetch
  const response = await fetch("/api/upload", {
    method: "POST",
    headers: {
      "Content-Type": file.type,
    },
    body: stream,
  });

  if (!response.ok) {
    throw new Error("Upload failed: " + response.statusText);
  }

  return await response.json();
}
