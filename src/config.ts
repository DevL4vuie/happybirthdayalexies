// Edit this file to personalise the greeting.
export const config = {
  recipient: 'Alexiesss',
  from: 'LouiG',
  introLine: 'You have a surprise waiting for you!',
  menuHint: 'Pick one to open',
  watermark: 'created by yours truly, LouiG,loy,louizg dina nko i apil tung uban ',
}

export type SectionId = 'pictures' | 'cake' | 'letter' | 'flower' | 'song'

export const sections: { id: SectionId; label: string }[] = [
  { id: 'pictures', label: 'Pictures' },
  { id: 'cake', label: 'Cake' },
  { id: 'letter', label: 'Letter' },
  { id: 'flower', label: 'Flower' },
  { id: 'song', label: 'Birthday Song' },
]

// Put your media in /public/photos and list their file names here.
export const photos: string[] = [
  'photo-1.jpg',
  'photo-2.jpg',
  'photo-3.jpg',
  'photo-4.jpg',
  'photo-5.jpg',
  'photo-6.jpg',
  'photo-7.jpg',
  'photo-8.jpg',
  'photo-9.jpg',
  'photo-10.jpg',
  'photo-11.jpg',
  'photo-12.jpg',
  'photo-13.jpg',
  'photo-14.jpg',
  'photo-15.jpg',
  'photo-16.jpg',
  'photo-17.jpg',
  'photo-18.jpg',
  'photo-19.jpg',
  'photo-20.jpg',
  'vid1.mp4',
  'vid2.mp4',
  'vid3.mp4',
  'vid4.mp4',
  'vid5.mp4',
]


