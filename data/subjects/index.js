/* ============================================================
   Rank Rank — extra subjects (separate from the Law section)
   ------------------------------------------------------------
   To ADD A SUBJECT: copy one { ... } block below and change it.
     id      short code, no spaces (used in saved progress — never rename later)
     name    full subject name
     paper   label shown on the card (any text)
     color   blue | indigo | purple | pink | red | orange | yellow | green | teal
     mcq     file with the questions (see data/subjects/sfm.js for the format), or null
     pdfs    files inside the  pdfs/subjects/<id>/  folder; "src.pdf" in the MCQ file = position in this list (0 = first)
   To ADD A PDF to a subject: put it in pdfs/subjects/<id>/ and add a line to its pdfs list.
   ============================================================ */
window.RR_SUBJECTS = [
  {
    id: 'SFM', name: 'Strategic Financial Management', paper: 'Paper 14', color: 'indigo',
    mcq: 'data/subjects/sfm.js',
    pdfs: [
      { name: 'SFM MCQ Book (with answer keys)', file: 'subjects/SFM/P14_SFM_MCQ_PDF.pdf' }
    ]
  },
  {
    id: 'SCM', name: 'Strategic Cost Management & Decision Making', paper: 'Paper 16', color: 'teal',
    mcq: 'data/subjects/scm.js',
    pdfs: [
      { name: 'SCM MCQs — marked (Palak Sharma)', file: 'subjects/SCM/SCM_Marked_MCQs__2_.pdf' },
      { name: 'SCM MCQs — unmarked (Palak Sharma)', file: 'subjects/SCM/Unmarked_MCQs__2_.pdf' },
      { name: 'SCM & DM Bullet MCQs with solutions (BCCA, Dec 25)', file: 'subjects/SCM/SCM___DM_MCQs_-_for_D25.pdf' }
    ]
  },
  {
    id: 'DT', name: 'Direct Tax Laws & International Taxation', paper: 'Paper 15', color: 'orange',
    mcq: null,
    pdfs: [
      { name: 'DT handwritten notes & MCQs — Part 4 (CA Bhaskar Magham)', file: 'subjects/DT/cma_final_dt-handwritten_notesandmcqs_part-4.pdf' }
    ]
  }
];
