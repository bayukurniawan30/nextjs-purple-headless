export default function getFileNameFromUrl(url: string) {
  const filename = url.substring(url.lastIndexOf('/') + 1)
  return filename
}
