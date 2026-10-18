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
// Music: paste YouTube links (full link, youtu.be link, or the 11-character id). Leave url empty to skip a slot.
export const tracks: { title: string; url: string }[] = [
  { title: 'Paradise', url: 'https://youtu.be/4tijiFGhBN8' },
  { title: 'Roxanne', url: 'https://youtu.be/bCW15UFuocE' },
  { title: 'the cure', url: 'https://youtu.be/LuxizOvIbog' },
  { title: 'Pure', url: 'https://youtu.be/tWK2AHJCyOw' },
  { title: 'Beautiful', url: 'https://youtu.be/BWC9OS45HAM' },
  { title: 'Moonlight', url: 'https://youtu.be/vUNK5rIssww' },
  { title: 'Last Night on Earth', url: 'https://youtu.be/oVZg-WwgivI' },
  { title: 'bad', url: 'https://youtu.be/6Q5xqNkCk7w' },
  { title: 'Nervous', url: 'https://youtu.be/XTDH7gSqwiQ' },
  { title: 'HER', url: 'https://youtu.be/wNliit0-u7c' },
  { title: 'I Love You Too Much | The Book of Life', url: 'https://youtu.be/hOD_iiJKLxk' },
  { title: 'When Love & Hate Collide', url: 'https://youtu.be/d7ew_jIxLa8' },
  { title: 'Only', url: 'https://youtu.be/KmOVNVZEP9o' },
  { title: 'All I Need To Hear', url: 'https://youtu.be/QFFZPlpXhsw' },
  { title: 'About You', url: 'https://youtu.be/tGv7CUutzqU' },
  { title: 'Risk it All', url: 'https://youtu.be/lY5V4hSLWY8' },
  { title: 'Why You Wanna Fight?', url: 'https://youtu.be/32yqPoXfaU4' },
  { title: 'On bended Knee', url: 'https://youtu.be/jSUSFow70no' },
]


