// A file counts as a video if its name ends with one of these.
export const isVideo = (name: string) => /\.(mp4|webm|mov|m4v)$/i.test(name)
export const mediaSrc = (name: string) => `${import.meta.env.BASE_URL}photos/${name}`