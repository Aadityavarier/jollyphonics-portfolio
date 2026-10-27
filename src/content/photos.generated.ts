// Written by `npm run photos` (scripts/photos.mjs). Do not edit by hand: change alt text in images.md and re-run.
import type { GalleryCategorySlug } from "./gallery";

export interface PhotoFile {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** The original this file came from (e.g. WA0064), so a page can avoid showing one photo twice. */
  source: string;
}

export const photoManifest: { slots: Record<string, PhotoFile>; gallery: (PhotoFile & { category: GalleryCategorySlug; thumb: string })[] } = {
  "slots": {
    "A1": {
      "src": "/images/about/A1.webp",
      "alt": "Trainer Revathi speaking to a hall of teachers with a microphone, in front of a screen titled “Jolly Phonics in the Classroom”",
      "width": 1010,
      "height": 1263,
      "source": "20260918-WA0001"
    },
    "A8": {
      "src": "/images/about/A8.webp",
      "alt": "Trainer Revathi sitting on a sofa beside a smiling young girl who holds her phonics certificate",
      "width": 899,
      "height": 899,
      "source": "WA0010"
    },
    "C1": {
      "src": "/images/coaching/C1.webp",
      "alt": "Trainer Revathi at a desk explaining a workbook to a small group of school children",
      "width": 1200,
      "height": 800,
      "source": "20260922-WA0008"
    },
    "C2": {
      "src": "/images/coaching/C2.webp",
      "alt": "Children writing in notebooks at their desks while a teacher bends to help one of them",
      "width": 1350,
      "height": 900,
      "source": "WA0053"
    },
    "H3": {
      "src": "/images/home/H3.webp",
      "alt": "A class of young children at their desks, smiling and raising their hands",
      "width": 1200,
      "height": 900,
      "source": "WA0064"
    },
    "H4": {
      "src": "/images/home/H4.webp",
      "alt": "Trainer Revathi going through a workbook at a desk with a small group of primary-school students",
      "width": 1200,
      "height": 900,
      "source": "WA0021"
    },
    "H6": {
      "src": "/images/home/H6.webp",
      "alt": "Four women at a teacher-training certificate presentation, one holding a certificate",
      "width": 960,
      "height": 720,
      "source": "20260620-WA0008"
    },
    "H7": {
      "src": "/images/home/H7.webp",
      "alt": "Trainer Revathi holding up a phonics card for a class of children in red school uniforms",
      "width": 900,
      "height": 600,
      "source": "WA0047"
    },
    "P1": {
      "src": "/images/programs/P1.webp",
      "alt": "Trainer Revathi holding up a phonics card for a class of children in red school uniforms",
      "width": 900,
      "height": 600,
      "source": "WA0047"
    },
    "P2": {
      "src": "/images/programs/P2.webp",
      "alt": "Children writing in notebooks at their desks while a teacher bends to help one of them",
      "width": 1350,
      "height": 900,
      "source": "WA0053"
    },
    "P5": {
      "src": "/images/programs/P5.webp",
      "alt": "A child colouring a drawing of a house with felt pens at a round table",
      "width": 1600,
      "height": 1067,
      "source": "WA0023"
    },
    "S1": {
      "src": "/images/for-schools/S1.webp",
      "alt": "Trainer Revathi in a school classroom teaching letter sounds from a whiteboard to children in red uniforms",
      "width": 1350,
      "height": 900,
      "source": "WA0045"
    },
    "S2": {
      "src": "/images/for-schools/S2.webp",
      "alt": "Trainer Revathi chatting with a young boy in a school classroom while a teacher looks on",
      "width": 1200,
      "height": 800,
      "source": "WA0048"
    },
    "T1": {
      "src": "/images/teacher-training/T1.webp",
      "alt": "Three women at a teacher-training certificate presentation, one holding the certificate",
      "width": 1200,
      "height": 800,
      "source": "20260610-WA0005"
    }
  },
  "gallery": [
    {
      "category": "certificate-distribution",
      "src": "/images/gallery/certificate-distribution/1.webp",
      "thumb": "/images/gallery/certificate-distribution/1-thumb.webp",
      "alt": "Trainer Revathi with a young girl holding her phonics course certificate",
      "width": 899,
      "height": 1599,
      "source": "WA0022"
    },
    {
      "category": "certificate-distribution",
      "src": "/images/gallery/certificate-distribution/2.webp",
      "thumb": "/images/gallery/certificate-distribution/2-thumb.webp",
      "alt": "A girl in glasses and Trainer Revathi holding her certificate in the classroom",
      "width": 900,
      "height": 1600,
      "source": "WA0043"
    },
    {
      "category": "certificate-distribution",
      "src": "/images/gallery/certificate-distribution/3.webp",
      "thumb": "/images/gallery/certificate-distribution/3-thumb.webp",
      "alt": "Trainer Revathi standing behind a smiling girl who holds her phonics certificate",
      "width": 899,
      "height": 1599,
      "source": "WA0095"
    },
    {
      "category": "certificate-distribution",
      "src": "/images/gallery/certificate-distribution/4.webp",
      "thumb": "/images/gallery/certificate-distribution/4-thumb.webp",
      "alt": "A young girl in a red dress sitting with Trainer Revathi, holding her certificate",
      "width": 899,
      "height": 1599,
      "source": "WA0010"
    },
    {
      "category": "certificate-distribution",
      "src": "/images/gallery/certificate-distribution/5.webp",
      "thumb": "/images/gallery/certificate-distribution/5-thumb.webp",
      "alt": "A smiling girl holding up her certificate of completion in front of the classroom whiteboard",
      "width": 1200,
      "height": 1600,
      "source": "WA0007"
    },
    {
      "category": "certificate-distribution",
      "src": "/images/gallery/certificate-distribution/6.webp",
      "thumb": "/images/gallery/certificate-distribution/6-thumb.webp",
      "alt": "A boy holding up his certificate of completion beside gold number balloons",
      "width": 1200,
      "height": 1600,
      "source": "WA0016"
    },
    {
      "category": "certificate-distribution",
      "src": "/images/gallery/certificate-distribution/7.webp",
      "thumb": "/images/gallery/certificate-distribution/7-thumb.webp",
      "alt": "A beaming boy holding his phonics certificate in front of the whiteboard",
      "width": 1200,
      "height": 1600,
      "source": "WA0027"
    },
    {
      "category": "certificate-distribution",
      "src": "/images/gallery/certificate-distribution/8.webp",
      "thumb": "/images/gallery/certificate-distribution/8-thumb.webp",
      "alt": "A boy in a white shirt and Trainer Revathi holding his certificate together",
      "width": 899,
      "height": 1599,
      "source": "WA0031"
    },
    {
      "category": "certificate-distribution",
      "src": "/images/gallery/certificate-distribution/9.webp",
      "thumb": "/images/gallery/certificate-distribution/9-thumb.webp",
      "alt": "A girl in school uniform receiving her certificate from Trainer Revathi in the classroom",
      "width": 900,
      "height": 1600,
      "source": "WA0068"
    },
    {
      "category": "certificate-distribution",
      "src": "/images/gallery/certificate-distribution/10.webp",
      "thumb": "/images/gallery/certificate-distribution/10-thumb.webp",
      "alt": "Trainer Revathi with a young girl holding her certificate of completion",
      "width": 899,
      "height": 1599,
      "source": "WA0084"
    },
    {
      "category": "drawing-art",
      "src": "/images/gallery/drawing-art/1.webp",
      "thumb": "/images/gallery/drawing-art/1-thumb.webp",
      "alt": "A child colouring a drawing of a house with felt pens at a round table",
      "width": 1600,
      "height": 1200,
      "source": "WA0023"
    },
    {
      "category": "drawing-art",
      "src": "/images/gallery/drawing-art/2.webp",
      "thumb": "/images/gallery/drawing-art/2-thumb.webp",
      "alt": "Two children drawing and painting at a low table, with finished pictures beside them",
      "width": 1600,
      "height": 1200,
      "source": "WA0014"
    },
    {
      "category": "drawing-art",
      "src": "/images/gallery/drawing-art/3.webp",
      "thumb": "/images/gallery/drawing-art/3-thumb.webp",
      "alt": "A teenager painting a blue watercolour while sitting on the floor",
      "width": 1200,
      "height": 1600,
      "source": "WA0032"
    },
    {
      "category": "events",
      "src": "/images/gallery/events/1.webp",
      "thumb": "/images/gallery/events/1-thumb.webp",
      "alt": "Trainer Revathi taking a Christmas selfie with smiling children in Santa hats",
      "width": 1599,
      "height": 1200,
      "source": "WA0093"
    },
    {
      "category": "events",
      "src": "/images/gallery/events/2.webp",
      "thumb": "/images/gallery/events/2-thumb.webp",
      "alt": "A line of children in Santa hats at a Christmas celebration",
      "width": 1600,
      "height": 1200,
      "source": "WA0110"
    },
    {
      "category": "events",
      "src": "/images/gallery/events/3.webp",
      "thumb": "/images/gallery/events/3-thumb.webp",
      "alt": "Trainer Revathi with two teachers at a Christmas celebration in the classroom",
      "width": 1600,
      "height": 900,
      "source": "WA0049"
    },
    {
      "category": "events",
      "src": "/images/gallery/events/4.webp",
      "thumb": "/images/gallery/events/4-thumb.webp",
      "alt": "Trainer Revathi and a teacher exchanging a gift in a decorated classroom",
      "width": 900,
      "height": 1600,
      "source": "WA0065"
    },
    {
      "category": "events",
      "src": "/images/gallery/events/5.webp",
      "thumb": "/images/gallery/events/5-thumb.webp",
      "alt": "A girl in a Santa hat standing beside a decorated Christmas tree",
      "width": 1200,
      "height": 1600,
      "source": "WA0086"
    },
    {
      "category": "events",
      "src": "/images/gallery/events/6.webp",
      "thumb": "/images/gallery/events/6-thumb.webp",
      "alt": "A girl in a Santa hat posing by the Christmas tree",
      "width": 1200,
      "height": 1600,
      "source": "WA0087"
    },
    {
      "category": "events",
      "src": "/images/gallery/events/7.webp",
      "thumb": "/images/gallery/events/7-thumb.webp",
      "alt": "A boy in a Santa hat and a colourful jacket beside the Christmas tree",
      "width": 1200,
      "height": 1600,
      "source": "WA0089"
    },
    {
      "category": "events",
      "src": "/images/gallery/events/8.webp",
      "thumb": "/images/gallery/events/8-thumb.webp",
      "alt": "A boy in a Santa hat smiling next to the Christmas tree",
      "width": 1200,
      "height": 1600,
      "source": "WA0097"
    },
    {
      "category": "phonics-classes",
      "src": "/images/gallery/phonics-classes/1.webp",
      "thumb": "/images/gallery/phonics-classes/1-thumb.webp",
      "alt": "Children writing in notebooks at their desks while a teacher bends to help one of them",
      "width": 1600,
      "height": 900,
      "source": "WA0053"
    },
    {
      "category": "phonics-classes",
      "src": "/images/gallery/phonics-classes/2.webp",
      "thumb": "/images/gallery/phonics-classes/2-thumb.webp",
      "alt": "A full phonics class at their desks, facing the teacher at the whiteboard",
      "width": 1600,
      "height": 900,
      "source": "WA0044"
    },
    {
      "category": "phonics-classes",
      "src": "/images/gallery/phonics-classes/3.webp",
      "thumb": "/images/gallery/phonics-classes/3-thumb.webp",
      "alt": "Children working at red and blue desks in a bright phonics classroom",
      "width": 1600,
      "height": 900,
      "source": "WA0046"
    },
    {
      "category": "phonics-classes",
      "src": "/images/gallery/phonics-classes/4.webp",
      "thumb": "/images/gallery/phonics-classes/4-thumb.webp",
      "alt": "A phonics class in progress, children at their desks with worksheets",
      "width": 1600,
      "height": 900,
      "source": "WA0051"
    },
    {
      "category": "phonics-classes",
      "src": "/images/gallery/phonics-classes/5.webp",
      "thumb": "/images/gallery/phonics-classes/5-thumb.webp",
      "alt": "Rows of children at their desks during a phonics lesson",
      "width": 1600,
      "height": 900,
      "source": "WA0052"
    },
    {
      "category": "phonics-classes",
      "src": "/images/gallery/phonics-classes/6.webp",
      "thumb": "/images/gallery/phonics-classes/6-thumb.webp",
      "alt": "Children working on worksheets while the teacher writes on the whiteboard",
      "width": 900,
      "height": 1600,
      "source": "WA0073"
    },
    {
      "category": "reading-activities",
      "src": "/images/gallery/reading-activities/1.webp",
      "thumb": "/images/gallery/reading-activities/1-thumb.webp",
      "alt": "A smiling girl holding up a Teenage Mutant Ninja Turtles storybook",
      "width": 1200,
      "height": 1600,
      "source": "WA0012"
    },
    {
      "category": "reading-activities",
      "src": "/images/gallery/reading-activities/2.webp",
      "thumb": "/images/gallery/reading-activities/2-thumb.webp",
      "alt": "A girl with bunches holding up the reader “Pepper at the table”",
      "width": 1200,
      "height": 1600,
      "source": "WA0019"
    },
    {
      "category": "reading-activities",
      "src": "/images/gallery/reading-activities/3.webp",
      "thumb": "/images/gallery/reading-activities/3-thumb.webp",
      "alt": "A girl holding up the book “Danny and the Dinosaur”",
      "width": 1200,
      "height": 1600,
      "source": "WA0004"
    },
    {
      "category": "reading-activities",
      "src": "/images/gallery/reading-activities/4.webp",
      "thumb": "/images/gallery/reading-activities/4-thumb.webp",
      "alt": "A boy proudly showing his Chacha Chaudhary comic book",
      "width": 1200,
      "height": 1600,
      "source": "WA0011"
    },
    {
      "category": "reading-activities",
      "src": "/images/gallery/reading-activities/5.webp",
      "thumb": "/images/gallery/reading-activities/5-thumb.webp",
      "alt": "A smiling girl holding up a picture storybook",
      "width": 1200,
      "height": 1600,
      "source": "WA0013"
    },
    {
      "category": "reading-activities",
      "src": "/images/gallery/reading-activities/6.webp",
      "thumb": "/images/gallery/reading-activities/6-thumb.webp",
      "alt": "A schoolgirl in uniform holding a Geronimo Stilton book",
      "width": 1200,
      "height": 1600,
      "source": "WA0015"
    },
    {
      "category": "reading-activities",
      "src": "/images/gallery/reading-activities/7.webp",
      "thumb": "/images/gallery/reading-activities/7-thumb.webp",
      "alt": "A girl in a red hairband holding the reader “Pepper goes to school”",
      "width": 1200,
      "height": 1600,
      "source": "WA0026"
    },
    {
      "category": "reading-activities",
      "src": "/images/gallery/reading-activities/8.webp",
      "thumb": "/images/gallery/reading-activities/8-thumb.webp",
      "alt": "Trainer Revathi taking a selfie with children each holding up a new book",
      "width": 1599,
      "height": 1200,
      "source": "WA0088"
    },
    {
      "category": "school-sessions",
      "src": "/images/gallery/school-sessions/1.webp",
      "thumb": "/images/gallery/school-sessions/1-thumb.webp",
      "alt": "School children at their desks turning to the camera, some waving",
      "width": 1600,
      "height": 900,
      "source": "WA0069"
    },
    {
      "category": "school-sessions",
      "src": "/images/gallery/school-sessions/2.webp",
      "thumb": "/images/gallery/school-sessions/2-thumb.webp",
      "alt": "Trainer Revathi in a school classroom teaching letter sounds from a whiteboard to children in red uniforms",
      "width": 1600,
      "height": 900,
      "source": "WA0045"
    },
    {
      "category": "school-sessions",
      "src": "/images/gallery/school-sessions/3.webp",
      "thumb": "/images/gallery/school-sessions/3-thumb.webp",
      "alt": "Trainer Revathi holding up a phonics card for a class of children in red school uniforms",
      "width": 900,
      "height": 1600,
      "source": "WA0047"
    },
    {
      "category": "school-sessions",
      "src": "/images/gallery/school-sessions/4.webp",
      "thumb": "/images/gallery/school-sessions/4-thumb.webp",
      "alt": "Trainer Revathi writing vowel sounds on a whiteboard for children in red uniforms",
      "width": 1600,
      "height": 900,
      "source": "WA0054"
    },
    {
      "category": "school-sessions",
      "src": "/images/gallery/school-sessions/5.webp",
      "thumb": "/images/gallery/school-sessions/5-thumb.webp",
      "alt": "A class of young children at their desks, smiling and raising their hands",
      "width": 1600,
      "height": 900,
      "source": "WA0064"
    },
    {
      "category": "school-sessions",
      "src": "/images/gallery/school-sessions/6.webp",
      "thumb": "/images/gallery/school-sessions/6-thumb.webp",
      "alt": "Trainer Revathi taking a selfie with a cheering class of school children",
      "width": 1600,
      "height": 900,
      "source": "WA0076"
    },
    {
      "category": "school-sessions",
      "src": "/images/gallery/school-sessions/7.webp",
      "thumb": "/images/gallery/school-sessions/7-thumb.webp",
      "alt": "Trainer Revathi showing a picture card to a boy in a school classroom",
      "width": 900,
      "height": 1600,
      "source": "WA0080"
    },
    {
      "category": "school-sessions",
      "src": "/images/gallery/school-sessions/8.webp",
      "thumb": "/images/gallery/school-sessions/8-thumb.webp",
      "alt": "Trainer Revathi chatting with a young boy in a school classroom while a teacher looks on",
      "width": 1200,
      "height": 1600,
      "source": "WA0048"
    },
    {
      "category": "teacher-training",
      "src": "/images/gallery/teacher-training/1.webp",
      "thumb": "/images/gallery/teacher-training/1-thumb.webp",
      "alt": "Trainer Revathi leading a teacher-training talk in front of a screen titled “Jolly Phonics in the Classroom”",
      "width": 1010,
      "height": 1557,
      "source": "20260918-WA0001"
    },
    {
      "category": "teacher-training",
      "src": "/images/gallery/teacher-training/2.webp",
      "thumb": "/images/gallery/teacher-training/2-thumb.webp",
      "alt": "Three women at a teacher-training certificate presentation, one holding the certificate",
      "width": 1200,
      "height": 1600,
      "source": "20260610-WA0005"
    },
    {
      "category": "teacher-training",
      "src": "/images/gallery/teacher-training/3.webp",
      "thumb": "/images/gallery/teacher-training/3-thumb.webp",
      "alt": "Four women at a teacher-training certificate presentation, one holding a certificate",
      "width": 960,
      "height": 1280,
      "source": "20260620-WA0008"
    },
    {
      "category": "teacher-training",
      "src": "/images/gallery/teacher-training/4.webp",
      "thumb": "/images/gallery/teacher-training/4-thumb.webp",
      "alt": "Trainer Revathi with a course participant holding her training certificate",
      "width": 1200,
      "height": 1600,
      "source": "20260620-WA0011"
    }
  ]
};
