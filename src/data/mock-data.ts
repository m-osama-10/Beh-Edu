import type {
  Subject,
  Grade,
  Teacher,
  Course,
  Review,
  Notification,
  Certificate,
  Announcement,
} from "@/types";

// ============ SUBJECTS ============
export const SUBJECTS: Subject[] = [
  { id: "s-1", name: "اللغة العربية", nameEn: "Arabic", icon: "BookOpen", color: "#0055A4", sortOrder: 1, coursesCount: 3 },
  { id: "s-2", name: "اللغة الإنجليزية", nameEn: "English", icon: "Languages", color: "#D7232E", sortOrder: 2, coursesCount: 2 },
  { id: "s-3", name: "الرياضيات", nameEn: "Mathematics", icon: "Calculator", color: "#FFD700", sortOrder: 3, coursesCount: 3 },
  { id: "s-4", name: "الفيزياء", nameEn: "Physics", icon: "Atom", color: "#7C3AED", sortOrder: 4, coursesCount: 2 },
  { id: "s-5", name: "الكيمياء", nameEn: "Chemistry", icon: "FlaskConical", color: "#10B981", sortOrder: 5, coursesCount: 2 },
  { id: "s-6", name: "الأحياء", nameEn: "Biology", icon: "Dna", color: "#F59E0B", sortOrder: 6, coursesCount: 2 },
  { id: "s-7", name: "التاريخ", nameEn: "History", icon: "ScrollText", color: "#92400E", sortOrder: 7, coursesCount: 1 },
  { id: "s-8", name: "الجغرافيا", nameEn: "Geography", icon: "Globe", color: "#06B6D4", sortOrder: 8, coursesCount: 1 },
];

// ============ GRADES ============
export const GRADES: Grade[] = [
  { id: "g-1", name: "الصف الأول الثانوي", nameEn: "Grade 1", level: 1, sortOrder: 1 },
  { id: "g-2", name: "الصف الثاني الثانوي", nameEn: "Grade 2", level: 2, sortOrder: 2 },
  { id: "g-3", name: "الصف الثالث الثانوي", nameEn: "Grade 3", level: 3, sortOrder: 3 },
];

// ============ TEACHERS ============
export const TEACHERS: Teacher[] = [
  {
    id: "t-1",
    userId: "u-teacher-1",
    name: "أ. محمد عبد الله",
    email: "teacher@bakaloriaa-bey.test",
    avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Mo&backgroundColor=0055A4",
    title: "أ.",
    bio: "مدرس رياضيات بخبرة تزيد عن 15 عاماً في تدريس الثانوية العامة. خريج كلية التربية - جامعة عين شمس. متخصص في تبسيط المفاهيم الرياضية المعقدة وجعلها سهلة الفهم لجميع الطلاب. أسلوبه يتميز بالشرح الممتع والأمثلة الواقعية التي تربط الرياضيات بحياتنا اليومية، مما يساعد الطلاب على الاستيعاب السريع والثبات في الامتحانات.",
    specialization: "الرياضيات - الصف الثالث الثانوي",
    yearsExperience: 15,
    education: "بكالوريوس تربية رياضيات - جامعة عين شمس",
    verified: true,
    approved: true,
    rating: 4.9,
    totalStudents: 3420,
    totalCourses: 4,
    totalRevenue: 285000,
  },
  {
    id: "t-2",
    userId: "u-teacher-2",
    name: "د. سارة محمود",
    email: "sara@bakaloriaa-bey.test",
    avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Sara&backgroundColor=D7232E",
    title: "د.",
    bio: "حاصلة على الدكتوراه في الكيمياء الفيزيائية من جامعة القاهرة. مدرسة كيمياء للثانوية العامة بخبرة 12 عاماً. تتميز بأسلوبها العلمي الدقيق وقدرتها على ربط الكيمياء النظرية بالتطبيقات العملية الصناعية والطبية. حاصلة على جائزة التميز العلمي من وزارة التربية والتعليم عام 2023.",
    specialization: "الكيمياء - الصف الثاني والثالث الثانوي",
    yearsExperience: 12,
    education: "دكتوراه في الكيمياء - جامعة القاهرة",
    verified: true,
    approved: true,
    rating: 4.8,
    totalStudents: 2180,
    totalCourses: 3,
    totalRevenue: 198000,
  },
  {
    id: "t-3",
    userId: "u-teacher-3",
    name: "م. أحمد فؤاد",
    email: "ahmad@bakaloriaa-bey.test",
    avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Ah&backgroundColor=FFD700",
    title: "م.",
    bio: "مهندس ومدرس فيزياء متخصص في فيزياء الثانوية العامة. خريج هندسة - جامعة الإسكندرية. يجمع بين الخبرة الأكاديمية والتطبيقية الصناعية، مما يجعل شرحه للفيزياء مليئاً بالأمثلة الواقعية من التكنولوجيا الحديثة والمجالات الهندسية المختلفة. أسلوبه العملي يساعد الطلاب على فهم المفاهيم الفيزيائية بعمق.",
    specialization: "الفيزياء - الصف الثالث الثانوي",
    yearsExperience: 9,
    education: "بكالوريوس هندسة - جامعة الإسكندرية",
    verified: true,
    approved: true,
    rating: 4.7,
    totalStudents: 1640,
    totalCourses: 2,
    totalRevenue: 142000,
  },
  {
    id: "t-4",
    userId: "u-teacher-4",
    name: "أ. منى السيد",
    email: "mona@bakaloriaa-bey.test",
    avatarUrl: "https://api.dicebar.com/7.x/initials/svg?seed=Mo&backgroundColor=8B5CF6",
    title: "أ.",
    bio: "مدرسة لغة عربية متخصصة في النحو والأدب للثانوية العامة. خبرة 18 عاماً في تدريس اللغة العربية بمدارس مصرية مختلفة. تتميز بأسلوبها السلس في شرح قواعد النحو المعقدة وقدرتها على إثراء محفظة الطلاب اللغوية. حاصلة على إجازة في القراءات القرآنية مما يعينها على إتقان مخارج الحروف وتلاوة النصوص الأدبية.",
    specialization: "اللغة العربية - جميع الصفوف",
    yearsExperience: 18,
    education: "بكالوريوس آداب لغة عربية - جامعة الأزهر",
    verified: true,
    approved: true,
    rating: 4.9,
    totalStudents: 4150,
    totalCourses: 5,
    totalRevenue: 312000,
  },
  {
    id: "t-5",
    userId: "u-teacher-5",
    name: "د. خالد رمضان",
    email: "khaled@bakaloriaa-bey.test",
    avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Kh&backgroundColor=10B981",
    title: "د.",
    bio: "دكتور في علم الأحياء الدقيقة ومدرس أحياء للثانوية العامة. خبرة بحثية وعملية في مجال البيولوجيا الجزيئية. يدمج في شرحه أحدث الاكتشافات العلمية والصور المجهرية ثلاثية الأبعاد لجعل مادة الأحياء أكثر متعة وفهماً للطلاب. حاصل على جائزة الباحث الشاب المصري 2022.",
    specialization: "الأحياء - الصف الثالث الثانوي",
    yearsExperience: 8,
    education: "دكتوراه في الأحياء الدقيقة - جامعة المنصورة",
    verified: true,
    approved: true,
    rating: 4.8,
    totalStudents: 1320,
    totalCourses: 2,
    totalRevenue: 118000,
  },
  {
    id: "t-6",
    userId: "u-teacher-6",
    name: "أ. هبة الله علي",
    email: "heba@bakaloriaa-bey.test",
    avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=He&backgroundColor=EC4899",
    title: "أ.",
    bio: "مدرسة لغة إنجليزية متخصصة في تحضير طلاب الثانوية العامة لامتحان اللغة الإنجليزية. خبرة 11 عاماً في تدريس IGCSE والثانوية العامة. حاصلة على شهادة CELTA من جامعة كامبريدج. تتميز بأسلوب تفاعلي يعتمد على تطوير مهارات التحدث والاستماع إلى جانب القواعد والكتابة الأكاديمية.",
    specialization: "اللغة الإنجليزية - الثانوية العامة",
    yearsExperience: 11,
    education: "بكالوريوس آداب إنجليزي + CELTA - جامعة عين شمس",
    verified: true,
    approved: true,
    rating: 4.7,
    totalStudents: 2890,
    totalCourses: 3,
    totalRevenue: 215000,
  },
];

// ============ COURSES ============
// Helper: build lessons for a section
function buildLessons(sectionId: string, count: number, startIdx: number) {
  const lessons = [];
  for (let i = 0; i < count; i++) {
    const id = `l-${sectionId}-${i + 1}`;
    const duration = 600 + Math.floor(Math.random() * 1200);
    lessons.push({
      id,
      sectionId,
      title: `الدرس ${startIdx + i}: ${["مقدمة وتأسيس", "شرح القاعدة الأساسية", "أمثلة محلولة", "تمارين تطبيقية", "حل أسئلة الكتاب المدرسي", "مراجعة شاملة", "امتحان محاكاة"][i % 7]}`,
      description: "شرح مفصل مع أمثلة عملية وتمارين متنوعة لضمان فهم كامل للمحتوى وتثبيت المعلومة.",
      sortOrder: i + 1,
      duration,
      isPreview: i === 0,
      isPublished: true,
      video: {
        id: `v-${id}`,
        lessonId: id,
        hlsPlaylistUrl: i % 2 === 0
          ? "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
          : "https://test-streams.mux.dev/test_001/stream.m3u8",
        status: "READY" as const,
        duration480p: duration,
        duration720p: duration,
        size480p: Math.floor(duration * 3.5 * 1024 * 1024 / 60),
        size720p: Math.floor(duration * 7 * 1024 * 1024 / 60),
        encryptionKey: "a1b2c3d4e5f67890123456789abcdef0",
        thumbnailUrl: `https://images.unsplash.com/photo-150${i}36624${sectionId}8844-6593?w=400&q=60&auto=format&fit=crop`,
      },
      attachments: i % 2 === 0
        ? [
            {
              id: `att-${id}-1`,
              lessonId: id,
              fileName: "مذكرة الدرس.pdf",
              fileUrl: "#",
              fileType: "pdf",
              fileSize: 1240000,
              isDownloadable: true,
            },
          ]
        : [],
      quizzes: i === 2 ? [
        {
          id: `q-${id}`,
          lessonId: id,
          title: "اختبار قصير على الدرس",
          description: "اختبر فهمك للدرس من خلال 5 أسئلة سريعة.",
          passingScore: 60,
          timeLimit: 10,
          questions: [
            {
              id: `qst-${id}-1`,
              quizId: `q-${id}`,
              text: "ما هي العبارة الصحيحة من بين العبارات التالية؟",
              type: "SINGLE_CHOICE" as const,
              points: 1,
              explanation: "الشرح يوضح أن الإجابة الصحيحة هي الخيار الأول لكونه يطابق القاعدة الأساسية.",
              sortOrder: 1,
              answers: [
                { id: `a-${id}-1-1`, questionId: `qst-${id}-1`, text: "الإجابة الأولى الصحيحة", isCorrect: true, sortOrder: 1 },
                { id: `a-${id}-1-2`, questionId: `qst-${id}-1`, text: "الإجابة الثانية الخاطئة", isCorrect: false, sortOrder: 2 },
                { id: `a-${id}-1-3`, questionId: `qst-${id}-1`, text: "الإجابة الثالثة الخاطئة", isCorrect: false, sortOrder: 3 },
                { id: `a-${id}-1-4`, questionId: `qst-${id}-1`, text: "الإجابة الرابعة الخاطئة", isCorrect: false, sortOrder: 4 },
              ],
            },
            {
              id: `qst-${id}-2`,
              quizId: `q-${id}`,
              text: "أي من التالية تعتبر من المفاهيم الأساسية في هذا الدرس؟",
              type: "MULTIPLE_CHOICE" as const,
              points: 2,
              sortOrder: 2,
              answers: [
                { id: `a-${id}-2-1`, questionId: `qst-${id}-2`, text: "المفهوم الأول", isCorrect: true, sortOrder: 1 },
                { id: `a-${id}-2-2`, questionId: `qst-${id}-2`, text: "المفهوم الثاني", isCorrect: true, sortOrder: 2 },
                { id: `a-${id}-2-3`, questionId: `qst-${id}-2`, text: "المفهوم الثالث", isCorrect: false, sortOrder: 3 },
              ],
            },
            {
              id: `qst-${id}-3`,
              quizId: `q-${id}`,
              text: "هل يمكن تطبيق ما تعلمته في هذا الدرس على مسائل الامتحان؟",
              type: "TRUE_FALSE" as const,
              points: 1,
              sortOrder: 3,
              answers: [
                { id: `a-${id}-3-1`, questionId: `qst-${id}-3`, text: "نعم", isCorrect: true, sortOrder: 1 },
                { id: `a-${id}-3-2`, questionId: `qst-${id}-3`, text: "لا", isCorrect: false, sortOrder: 2 },
              ],
            },
          ],
        },
      ] : [],
    });
  }
  return lessons;
}

function buildSections(courseId: string, sectionsData: { title: string; lessons: number }[]) {
  return sectionsData.map((s, idx) => {
    const sectionId = `${courseId}-${idx + 1}`;
    return {
      id: sectionId,
      courseId,
      title: s.title,
      description: "هذا الباب يغطي مجموعة من الدروس المترابطة التي تبني المعرفة تدريجياً.",
      sortOrder: idx + 1,
      lessons: buildLessons(sectionId, s.lessons, idx * 5 + 1),
    };
  });
}

export const COURSES: Course[] = [
  {
    id: "c-1",
    teacherId: "t-1",
    teacher: TEACHERS[0],
    subjectId: "s-3",
    subject: SUBJECTS[2],
    gradeId: "g-3",
    grade: GRADES[2],
    title: "الرياضيات التطبيقية - الصف الثالث الثانوي 2026",
    slug: "math-grade3-2026",
    description: "كورس شامل في الرياضيات التطبيقية لطلاب الصف الثالث الثانوي للعام الدراسي 2025/2026. يغطي الكورس المنهج كاملاً من التفاضل والتكامل حتى الجبر والهندسة التحليلية، مع التركيز على أسئلة الامتحانات السابقة وأساليب الحل السريع. تم تصميم الكورس خصيصاً لتنمية مهارات حل المسائل بثقة وسرعة، وبناء فهم عميق للمفاهيم الأساسية التي يحتاجها كل طالب في امتحان الثانوية العامة.",
    coverImageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=70&auto=format&fit=crop",
    previewVideoUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    price: 599,
    discountPrice: 399,
    discountUntil: new Date(Date.now() + 7 * 86400000).toISOString(),
    level: "ADVANCED",
    academicYear: "2025/2026",
    language: "العربية",
    isPublished: true,
    isFeatured: true,
    views: 12450,
    rating: 4.9,
    ratingCount: 248,
    studentCount: 856,
    totalLessons: 18,
    totalDuration: 32400,
    createdAt: "2025-09-15T10:00:00Z",
    sections: buildSections("c-1", [
      { title: "الباب الأول: التفاضل", lessons: 5 },
      { title: "الباب الثاني: التكامل", lessons: 4 },
      { title: "الباب الثالث: الجبر", lessons: 5 },
      { title: "الباب الرابع: الهندسة التحليلية", lessons: 4 },
    ]),
  },
  {
    id: "c-2",
    teacherId: "t-2",
    teacher: TEACHERS[1],
    subjectId: "s-5",
    subject: SUBJECTS[4],
    gradeId: "g-3",
    grade: GRADES[2],
    title: "الكيمياء العضوية - شرح كامل ومنظوم",
    slug: "chemistry-organic-2026",
    description: "كورس متكامل في الكيمياء العضوية يغطي جميع الأبواب بالتفصيل. شرح علمي مبسط مع رسم المعادلات الخطية بشكل احترافي، وحل أسئلة الكتاب المدرسي وأسئلة الامتحانات السابقة. الكورس يتضمن مذكرات إلكترونية قابلة للتحميل واختبارات تفاعلية بعد كل درس. مناسب لطلاب الثانوية العامة الساعين للحصول على درجات التفوق في الكيمياء العضوية.",
    coverImageUrl: "https://images.unsplash.com/photo-1532634922-8fe0b757fb13?w=800&q=70&auto=format&fit=crop",
    previewVideoUrl: "https://test-streams.mux.dev/test_001/stream.m3u8",
    price: 499,
    discountPrice: 349,
    discountUntil: new Date(Date.now() + 5 * 86400000).toISOString(),
    level: "INTERMEDIATE",
    academicYear: "2025/2026",
    language: "العربية",
    isPublished: true,
    isFeatured: true,
    views: 8920,
    rating: 4.8,
    ratingCount: 187,
    studentCount: 624,
    totalLessons: 16,
    totalDuration: 28800,
    createdAt: "2025-09-20T10:00:00Z",
    sections: buildSections("c-2", [
      { title: "الباب الأول: الهيدروكربونات", lessons: 4 },
      { title: "الباب الثاني: المجموعات الوظيفية", lessons: 5 },
      { title: "الباب الثالث: الكيمياء العضوية التطبيقية", lessons: 4 },
      { title: "الباب الرابع: المراجعة النهائية", lessons: 3 },
    ]),
  },
  {
    id: "c-3",
    teacherId: "t-3",
    teacher: TEACHERS[2],
    subjectId: "s-4",
    subject: SUBJECTS[3],
    gradeId: "g-3",
    grade: GRADES[2],
    title: "الفيزياء الحديثة - امتحانات ومسائل",
    slug: "physics-modern-2026",
    description: "كورس الفيزياء الحديثة للصف الثالث الثانوي بأسلوب مبسط وعلمي. يغطي الكورس الفيزياء الحديثة، فيزياء الذرة، والإلكترونيات مع حل المسائل الصعبة بطريقة مبسطة. يتميز الكورس بتوفير مذكرات مرئية وتطبيقات عملية تساعد الطلاب على تصور الظواهر الفيزيائية بشكل ملموس. مناسب للطلاب الذين يهدفون للتفوق في امتحان الفيزياء ودخول كليات القمة.",
    coverImageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=70&auto=format&fit=crop",
    previewVideoUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    price: 549,
    discountPrice: 449,
    level: "ADVANCED",
    academicYear: "2025/2026",
    language: "العربية",
    isPublished: true,
    isFeatured: true,
    views: 6720,
    rating: 4.7,
    ratingCount: 134,
    studentCount: 478,
    totalLessons: 14,
    totalDuration: 25200,
    createdAt: "2025-10-01T10:00:00Z",
    sections: buildSections("c-3", [
      { title: "الباب الأول: فيزياء الذرة", lessons: 4 },
      { title: "الباب الثاني: الإلكترونيات", lessons: 4 },
      { title: "الباب الثالث: الفيزياء النووية", lessons: 3 },
      { title: "الباب الرابع: المراجعة والامتحانات", lessons: 3 },
    ]),
  },
  {
    id: "c-4",
    teacherId: "t-4",
    teacher: TEACHERS[3],
    subjectId: "s-1",
    subject: SUBJECTS[0],
    gradeId: "g-3",
    grade: GRADES[2],
    title: "اللغة العربية - النحو والأدب والبلاغة",
    slug: "arabic-full-2026",
    description: "كورس اللغة العربية الشامل لطلاب الثانوية العامة يغطي النحو والبلاغة والأدب والنصوص. شرح تفصيلي لكل قاعدة نحوية مع تطبيقات عملية، وتحليل أدبي للنصوص المقررة، وتدريبات على البلاغة والصور البيانية. الكورس يتضمن اختبارات دورية وملخصات نهائية تساعد على المراجعة السريعة قبل الامتحان. مع أ. منى السيد بخبرتها 18 عاماً في تدريس اللغة العربية.",
    coverImageUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=70&auto=format&fit=crop",
    previewVideoUrl: "https://test-streams.mux.dev/test_001/stream.m3u8",
    price: 449,
    discountPrice: 299,
    discountUntil: new Date(Date.now() + 10 * 86400000).toISOString(),
    level: "ALL_LEVELS",
    academicYear: "2025/2026",
    language: "العربية",
    isPublished: true,
    isFeatured: true,
    views: 15630,
    rating: 4.9,
    ratingCount: 312,
    studentCount: 1124,
    totalLessons: 22,
    totalDuration: 39600,
    createdAt: "2025-09-05T10:00:00Z",
    sections: buildSections("c-4", [
      { title: "الباب الأول: النحو", lessons: 6 },
      { title: "الباب الثاني: البلاغة", lessons: 5 },
      { title: "الباب الثالث: الأدب", lessons: 6 },
      { title: "الباب الرابع: النصوص والمراجعة", lessons: 5 },
    ]),
  },
  {
    id: "c-5",
    teacherId: "t-5",
    teacher: TEACHERS[4],
    subjectId: "s-6",
    subject: SUBJECTS[5],
    gradeId: "g-3",
    grade: GRADES[2],
    title: "الأحياء - المنهج الكامل بالصور والرسومات",
    slug: "biology-full-2026",
    description: "كورس الأحياء الشامل لطلاب الثانوية العامة مع التركيز على الفهم البصري من خلال الصور المجهرية عالية الدقة والرسوم التوضيحية ثلاثية الأبعاد. يغطي الكورس جميع فصول المنهج من الخلية حتى الوراثة والمناعة. يقدم الكورس مذكرات مصورة ومنظمات بيانية تساعد على المراجعة السريعة. مع د. خالد رمضان الذي يجمع بين الخبرة الأكاديمية والبحثية.",
    coverImageUrl: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=800&q=70&auto=format&fit=crop",
    previewVideoUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    price: 479,
    discountPrice: 379,
    level: "INTERMEDIATE",
    academicYear: "2025/2026",
    language: "العربية",
    isPublished: true,
    isFeatured: false,
    views: 5430,
    rating: 4.8,
    ratingCount: 98,
    studentCount: 412,
    totalLessons: 16,
    totalDuration: 28800,
    createdAt: "2025-09-25T10:00:00Z",
    sections: buildSections("c-5", [
      { title: "الباب الأول: الخلية", lessons: 4 },
      { title: "الباب الثاني: التغذية والتنفس", lessons: 4 },
      { title: "الباب الثالث: الوراثة", lessons: 4 },
      { title: "الباب الرابع: المناعة والصحة", lessons: 4 },
    ]),
  },
  {
    id: "c-6",
    teacherId: "t-6",
    teacher: TEACHERS[5],
    subjectId: "s-2",
    subject: SUBJECTS[1],
    gradeId: "g-3",
    grade: GRADES[2],
    title: "اللغة الإنجليزية - Grammar & Writing Mastery",
    slug: "english-grammar-writing-2026",
    description: "كورس اللغة الإنجليزية المتكامل لطلاب الثانوية العامة يركز على القواعد الأساسية والمتقدمة، الكتابة الأكاديمية، والمفردات المطلوبة في الامتحان. مع أ. هبة الله علي الحاصلة على شهادة CELTA الدولية. الكورس يتضمن تدريبات تفاعلية على الاستماع والمحادثة، واختبارات تحاكي امتحان الثانوية العامة. مناسب لجميع المستويات من المبتدئ حتى المتقدم.",
    coverImageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=70&auto=format&fit=crop",
    previewVideoUrl: "https://test-streams.mux.dev/test_001/stream.m3u8",
    price: 449,
    discountPrice: 329,
    discountUntil: new Date(Date.now() + 14 * 86400000).toISOString(),
    level: "ALL_LEVELS",
    academicYear: "2025/2026",
    language: "العربية",
    isPublished: true,
    isFeatured: true,
    views: 9870,
    rating: 4.7,
    ratingCount: 201,
    studentCount: 743,
    totalLessons: 18,
    totalDuration: 32400,
    createdAt: "2025-09-12T10:00:00Z",
    sections: buildSections("c-6", [
      { title: "Unit 1: Tenses & Verb Forms", lessons: 5 },
      { title: "Unit 2: Sentence Structure", lessons: 4 },
      { title: "Unit 3: Writing Skills", lessons: 5 },
      { title: "Unit 4: Exam Practice", lessons: 4 },
    ]),
  },
  {
    id: "c-7",
    teacherId: "t-1",
    teacher: TEACHERS[0],
    subjectId: "s-3",
    subject: SUBJECTS[2],
    gradeId: "g-2",
    grade: GRADES[1],
    title: "الرياضيات - الجبر والهندسة - الصف الثاني الثانوي",
    slug: "math-grade2-2026",
    description: "كورس الرياضيات للصف الثاني الثانوي يغطي الجبر والهندسة الفراغية والمثلثات. شرح مبسط مع أمثلة محلولة بالتفصيل وتمارين متنوعة المستويات. الكورس مصمم لتأسيس الطلاب تأسيساً قوياً استعداداً للصف الثالث الثانوي. يتضمن مذكرات إلكترونية واختبارات شهرية لمتابعة المستوى.",
    coverImageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&q=70&auto=format&fit=crop",
    previewVideoUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    price: 399,
    discountPrice: 299,
    level: "INTERMEDIATE",
    academicYear: "2025/2026",
    language: "العربية",
    isPublished: true,
    isFeatured: false,
    views: 4320,
    rating: 4.6,
    ratingCount: 76,
    studentCount: 312,
    totalLessons: 14,
    totalDuration: 25200,
    createdAt: "2025-10-05T10:00:00Z",
    sections: buildSections("c-7", [
      { title: "الباب الأول: الجبر", lessons: 4 },
      { title: "الباب الثاني: الهندسة الفراغية", lessons: 4 },
      { title: "الباب الثالث: المثلثات", lessons: 4 },
      { title: "الباب الرابع: المراجعة", lessons: 2 },
    ]),
  },
  {
    id: "c-8",
    teacherId: "t-4",
    teacher: TEACHERS[3],
    subjectId: "s-1",
    subject: SUBJECTS[0],
    gradeId: "g-2",
    grade: GRADES[1],
    title: "اللغة العربية - الصف الثاني الثانوي",
    slug: "arabic-grade2-2026",
    description: "كورس اللغة العربية للصف الثاني الثانوي يغطي النحو والبلاغة والأدب والنصوص الخاصة بمنهج الصف الثاني. شرح تفصيلي مع تدريبات عملية وملخصات شاملة. مع أ. منى السيد التي تتميز بأسلوبها السلس في تبسيط المفاهيم النحوية المعقدة وتحبيب الطلاب في مادة اللغة العربية.",
    coverImageUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=70&auto=format&fit=crop",
    previewVideoUrl: "https://test-streams.mux.dev/test_001/stream.m3u8",
    price: 349,
    discountPrice: 249,
    level: "ALL_LEVELS",
    academicYear: "2025/2026",
    language: "العربية",
    isPublished: true,
    isFeatured: false,
    views: 3210,
    rating: 4.7,
    ratingCount: 65,
    studentCount: 287,
    totalLessons: 12,
    totalDuration: 21600,
    createdAt: "2025-10-08T10:00:00Z",
    sections: buildSections("c-8", [
      { title: "الباب الأول: النحو", lessons: 4 },
      { title: "الباب الثاني: البلاغة", lessons: 3 },
      { title: "الباب الثالث: الأدب والنصوص", lessons: 5 },
    ]),
  },
  {
    id: "c-9",
    teacherId: "t-2",
    teacher: TEACHERS[1],
    subjectId: "s-5",
    subject: SUBJECTS[4],
    gradeId: "g-2",
    grade: GRADES[1],
    title: "الكيمياء العامة - الصف الثاني الثانوي",
    slug: "chemistry-grade2-2026",
    description: "كورس الكيمياء العامة للصف الثاني الثانوي يغطي التركيب الذري والروابط الكيميائية والتفاعلات الكيميائية. شرح علمي مبسط مع تجارب افتراضية وأمثلة محلولة. الكورس مصمم لتأسيس الطلاب في الأساسيات الكيميائية استعداداً للصف الثالث الثانوي. يتضمن مذكرات مرئية واختبارات تفاعلية.",
    coverImageUrl: "https://images.unsplash.com/photo-1554475901-4538ddfbccc2?w=800&q=70&auto=format&fit=crop",
    previewVideoUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    price: 379,
    discountPrice: 279,
    level: "BEGINNER",
    academicYear: "2025/2026",
    language: "العربية",
    isPublished: true,
    isFeatured: false,
    views: 2870,
    rating: 4.6,
    ratingCount: 54,
    studentCount: 234,
    totalLessons: 12,
    totalDuration: 21600,
    createdAt: "2025-10-12T10:00:00Z",
    sections: buildSections("c-9", [
      { title: "الباب الأول: التركيب الذري", lessons: 3 },
      { title: "الباب الثاني: الروابط الكيميائية", lessons: 3 },
      { title: "الباب الثالث: التفاعلات", lessons: 3 },
      { title: "الباب الرابع: المراجعة", lessons: 3 },
    ]),
  },
  {
    id: "c-10",
    teacherId: "t-3",
    teacher: TEACHERS[2],
    subjectId: "s-4",
    subject: SUBJECTS[3],
    gradeId: "g-2",
    grade: GRADES[1],
    title: "الفيزياء - الصف الثاني الثانوي",
    slug: "physics-grade2-2026",
    description: "كورس الفيزياء للصف الثاني الثانوي يغطي الميكانيكا والكهرباء والمغناطيسية بأسلوب مبسط. شرح نظري مع تطبيقات عملية وحل المسائل بطرق متعددة. مع م. أحمد فؤاد الذي يدمج الخبرة الأكاديمية بالتطبيق الصناعي. الكورس مناسب لتأسيس الطلاب وتجهيزهم للصف الثالث الثانوي بقوة.",
    coverImageUrl: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&q=70&auto=format&fit=crop",
    previewVideoUrl: "https://test-streams.mux.dev/test_001/stream.m3u8",
    price: 399,
    discountPrice: 319,
    level: "INTERMEDIATE",
    academicYear: "2025/2026",
    language: "العربية",
    isPublished: true,
    isFeatured: false,
    views: 2150,
    rating: 4.5,
    ratingCount: 41,
    studentCount: 187,
    totalLessons: 11,
    totalDuration: 19800,
    createdAt: "2025-10-15T10:00:00Z",
    sections: buildSections("c-10", [
      { title: "الباب الأول: الميكانيكا", lessons: 4 },
      { title: "الباب الثاني: الكهرباء", lessons: 4 },
      { title: "الباب الثالث: المغناطيسية", lessons: 3 },
    ]),
  },
  {
    id: "c-11",
    teacherId: "t-5",
    teacher: TEACHERS[4],
    subjectId: "s-6",
    subject: SUBJECTS[5],
    gradeId: "g-1",
    grade: GRADES[0],
    title: "الأحياء - الصف الأول الثانوي",
    slug: "biology-grade1-2026",
    description: "كورس الأحياء للصف الأول الثانوي يغطي أساسيات علم الأحياء، الخلية، التنوع الحيوي، والأنظمة الحيوية. شرح مبسط مناسب للطلاب المستجدين بالثانوية العامة مع صور ورسومات توضيحية. الكورس يساعد على بناء قاعدة علمية قوية لاستكمال دراسة الأحياء في الصفوف التالية. يتضمن مذكرات واختبارات قصيرة.",
    coverImageUrl: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800&q=70&auto=format&fit=crop",
    previewVideoUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    price: 299,
    discountPrice: 229,
    level: "BEGINNER",
    academicYear: "2025/2026",
    language: "العربية",
    isPublished: true,
    isFeatured: false,
    views: 1980,
    rating: 4.6,
    ratingCount: 37,
    studentCount: 165,
    totalLessons: 10,
    totalDuration: 18000,
    createdAt: "2025-10-20T10:00:00Z",
    sections: buildSections("c-11", [
      { title: "الباب الأول: مدخل للأحياء", lessons: 3 },
      { title: "الباب الثاني: الخلية", lessons: 3 },
      { title: "الباب الثالث: التنوع الحيوي", lessons: 4 },
    ]),
  },
  {
    id: "c-12",
    teacherId: "t-6",
    teacher: TEACHERS[5],
    subjectId: "s-2",
    subject: SUBJECTS[1],
    gradeId: "g-1",
    grade: GRADES[0],
    title: "اللغة الإنجليزية - الصف الأول الثانوي",
    slug: "english-grade1-2026",
    description: "كورس اللغة الإنجليزية للصف الأول الثانوي يركز على بناء الأساسيات في القواعد والمفردات والمهارات الأساسية الأربعة (استماع، محادثة، قراءة، كتابة). مع أ. هبة الله علي الحاصلة على شهادة CELTA. الكورس مناسب للطلاب المستجدين بالثانوية العامة ويساعدهم على بناء قاعدة لغوية قوية.",
    coverImageUrl: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&q=70&auto=format&fit=crop",
    previewVideoUrl: "https://test-streams.mux.dev/test_001/stream.m3u8",
    price: 279,
    discountPrice: 199,
    level: "BEGINNER",
    academicYear: "2025/2026",
    language: "العربية",
    isPublished: true,
    isFeatured: false,
    views: 1620,
    rating: 4.5,
    ratingCount: 28,
    studentCount: 142,
    totalLessons: 10,
    totalDuration: 18000,
    createdAt: "2025-10-22T10:00:00Z",
    sections: buildSections("c-12", [
      { title: "Unit 1: Basics", lessons: 3 },
      { title: "Unit 2: Grammar Foundations", lessons: 4 },
      { title: "Unit 3: Reading & Writing", lessons: 3 },
    ]),
  },
];

// ============ REVIEWS ============
export const REVIEWS: Review[] = [
  { id: "r-1", userId: "u-1", user: { name: "أحمد محمود", avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Ah" }, courseId: "c-1", rating: 5, comment: "شرح رائع ومبسط جداً، استفدت كثيراً وحصلت على درجات عالية في الامتحان. أنصح كل زملائي بالكورس. المدرس متمكن وأسلوبه ممتع.", createdAt: "2025-11-15T10:00:00Z" },
  { id: "r-2", userId: "u-2", user: { name: "فاطمة علي", avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Fa" }, courseId: "c-1", rating: 5, comment: "من أفضل الكورسات اللي درستها. التمارين متنوعة والشرح وافي. الفيديوهات بجودة ممتازة وتستهلك باقة إنترنت قليلة.", createdAt: "2025-11-20T10:00:00Z" },
  { id: "r-3", userId: "u-3", user: { name: "محمود السيد", avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Ma" }, courseId: "c-2", rating: 4, comment: "الكورس ممتاز لكن كان نفسي لو كان فيه فيديوهات أكثر للتجارب العملية. بشكل عام استفدت جداً وأنصح به.", createdAt: "2025-11-25T10:00:00Z" },
  { id: "r-4", userId: "u-4", user: { name: "سارة إبراهيم", avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Sa" }, courseId: "c-4", rating: 5, comment: "أ. منونة شرحها رائع ومبسط. النحو اللي كنت بكرهه بقيت بحبه. ربنا يكرمها ويبارك في علمها وعملها.", createdAt: "2025-12-01T10:00:00Z" },
  { id: "r-5", userId: "u-5", user: { name: "عمر خالد", avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Om" }, courseId: "c-3", rating: 5, comment: "م. أحمد بيشرح الفيزياء كأنها قصة. الأمثلة العملية بتسهل الفهم جداً. جودة الفيديو ممتازة والتقطيع لا يوجد.", createdAt: "2025-12-05T10:00:00Z" },
  { id: "r-6", userId: "u-6", user: { name: "نورهان أحمد", avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=No" }, courseId: "c-6", rating: 4, comment: "كورس ممتاز للمبتدئين. بس محتاجين تدريبات أكتر على المحادثة. بشكل عام الكورس يستحق الثمن.", createdAt: "2025-12-10T10:00:00Z" },
];

// ============ NOTIFICATIONS ============
export const NOTIFICATIONS: Notification[] = [
  { id: "n-1", userId: "u-student-1", title: "درس جديد متاح", message: "تم إضافة درس جديد في كورس الرياضيات التطبيقية - الباب الثاني", type: "LESSON", isRead: false, link: "watch?courseId=c-1&lessonId=l-c-1-2-1", createdAt: new Date(Date.now() - 2 * 3600000).toISOString() },
  { id: "n-2", userId: "u-student-1", title: "خصم 30% لفترة محدودة", message: "استفد من خصم 30% على جميع كورسات الصف الثالث الثانوي لمدة أسبوع", type: "INFO", isRead: false, link: "courses", createdAt: new Date(Date.now() - 6 * 3600000).toISOString() },
  { id: "n-3", userId: "u-student-1", title: "تهانينا! أكملت درساً", message: "أحسنت! لقد أكملت درس 'الدرس 1: مقدمة وتأسيس' بنجاح", type: "SUCCESS", isRead: true, link: "watch?courseId=c-1&lessonId=l-c-1-1-1", createdAt: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: "n-4", userId: "u-student-1", title: "تم تأكيد الدفع", message: "تم تأكيد دفعتك بقيمة 399 ج.م لكورس الرياضيات التطبيقية", type: "PAYMENT", isRead: true, link: "student-dashboard", createdAt: new Date(Date.now() - 5 * 86400000).toISOString() },
  { id: "n-5", userId: "u-student-1", title: "إعلان من أ. محمد عبد الله", message: "سأقوم ببث مباشر مراجعة نهائية يوم الجمعة الساعة 8 مساءً", type: "ANNOUNCEMENT", isRead: true, link: "student-dashboard", createdAt: new Date(Date.now() - 7 * 86400000).toISOString() },
  { id: "n-6", userId: "u-student-1", title: "حصلت على شهادة!", message: "مبروك! لقد حصلت على شهادة إتمام كورس 'مقدمة في الرياضيات'", type: "CERTIFICATE", isRead: true, link: "certificates", createdAt: new Date(Date.now() - 10 * 86400000).toISOString() },
];

// ============ CERTIFICATES ============
export const CERTIFICATES: Certificate[] = [
  {
    id: "cert-1",
    userId: "u-student-1",
    studentName: "أحمد محمود",
    courseId: "c-7",
    courseTitle: "الرياضيات - الجبر والهندسة - الصف الثاني الثانوي",
    teacherName: "أ. محمد عبد الله",
    certificateNumber: "BB-2025-0001",
    finalScore: 92,
    issuedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: "cert-2",
    userId: "u-student-1",
    studentName: "أحمد محمود",
    courseId: "c-9",
    courseTitle: "الكيمياء العامة - الصف الثاني الثانوي",
    teacherName: "د. سارة محمود",
    certificateNumber: "BB-2025-0002",
    finalScore: 88,
    issuedAt: new Date(Date.now() - 15 * 86400000).toISOString(),
  },
];

// ============ ANNOUNCEMENTS ============
export const ANNOUNCEMENTS: Announcement[] = [
  { id: "a-1", teacherId: "t-1", courseId: "c-1", title: "بث مباشر مراجعة نهائية", content: "أعزائي الطلاب، سأقوم بعمل بث مباشر لمراجعة نهائية شاملة يوم الجمعة القادم الساعة 8 مساءً. البث سيكون مجانياً لجميع المشتركين في الكورس. لا تنسوا تجهيز أسئلتكم.", isPinned: true, createdAt: new Date(Date.now() - 1 * 86400000).toISOString() },
  { id: "a-2", teacherId: "t-2", courseId: "c-2", title: "إضافة مذكرة جديدة", content: "تم رفع مذكرة شاملة للباب الثاني (المجموعات الوظيفية) على الدروس. يمكنكم تحميلها من قسم المرفقات في كل درس.", isPinned: false, createdAt: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: "a-3", teacherId: "t-4", courseId: "c-4", title: "اختبار شهر الكورس", content: "سيتوفر اختبار شامل على الباب الأول (النحو) يوم السبت القادم. الاختبار مدته ساعة ويحتوي على 30 سؤال. استعدوا جيداً!", isPinned: false, createdAt: new Date(Date.now() - 5 * 86400000).toISOString() },
];

// ============ PLATFORM STATS ============
export const PLATFORM_STATS = {
  totalStudents: 12480,
  totalCourses: 486,
  totalTeachers: 52,
  averageRating: 4.8,
  totalRevenue: 2450000,
  totalWatchHours: 86400,
};

// ============ USERS MOCK (for admin) ============
export const USERS_MOCK = [
  { id: "u-admin-1", name: "مدير المنصة", email: "admin@bakaloriaa-bey.test", role: "ADMIN" as const, status: "ACTIVE" as const, createdAt: "2025-09-01T10:00:00Z", avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Admin&backgroundColor=0055A4" },
  { id: "u-teacher-1", name: "أ. محمد عبد الله", email: "teacher@bakaloriaa-bey.test", role: "TEACHER" as const, status: "ACTIVE" as const, createdAt: "2025-08-15T10:00:00Z", avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Mo&backgroundColor=D7232E" },
  { id: "u-student-1", name: "أحمد محمود", email: "student@bakaloriaa-bey.test", role: "STUDENT" as const, status: "ACTIVE" as const, createdAt: "2025-09-10T10:00:00Z", avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Ah&backgroundColor=FFD700" },
  { id: "u-2", name: "فاطمة علي", email: "fatma@email.com", role: "STUDENT" as const, status: "ACTIVE" as const, createdAt: "2025-09-12T10:00:00Z", avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Fa" },
  { id: "u-3", name: "محمود السيد", email: "mahmoud@email.com", role: "STUDENT" as const, status: "ACTIVE" as const, createdAt: "2025-09-15T10:00:00Z", avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Ma" },
  { id: "u-4", name: "سارة إبراهيم", email: "sara@email.com", role: "STUDENT" as const, status: "ACTIVE" as const, createdAt: "2025-09-18T10:00:00Z", avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Sa" },
  { id: "u-5", name: "عمر خالد", email: "omar@email.com", role: "STUDENT" as const, status: "ACTIVE" as const, createdAt: "2025-09-20T10:00:00Z", avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Om" },
  { id: "u-6", name: "نورهان أحمد", email: "norhan@email.com", role: "STUDENT" as const, status: "ACTIVE" as const, createdAt: "2025-09-25T10:00:00Z", avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=No" },
  { id: "u-7", name: "كريم حسن", email: "karim@email.com", role: "TEACHER" as const, status: "PENDING" as const, createdAt: "2025-12-10T10:00:00Z", avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Kh" },
  { id: "u-8", name: "منى رضا", email: "mona.r@email.com", role: "TEACHER" as const, status: "PENDING" as const, createdAt: "2025-12-12T10:00:00Z", avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Mo" },
  { id: "u-9", name: "شريف نبيل", email: "sherif@email.com", role: "TEACHER" as const, status: "PENDING" as const, createdAt: "2025-12-14T10:00:00Z", avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Sh" },
  { id: "u-10", name: "محمد طارق", email: "mohamed.t@email.com", role: "STUDENT" as const, status: "SUSPENDED" as const, createdAt: "2025-10-01T10:00:00Z", avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Mt" },
];

// ============ REVENUE DATA (for charts) ============
export const REVENUE_DATA = [
  { month: "يناير", revenue: 145000, students: 320 },
  { month: "فبراير", revenue: 168000, students: 380 },
  { month: "مارس", revenue: 192000, students: 425 },
  { month: "أبريل", revenue: 215000, students: 470 },
  { month: "مايو", revenue: 198000, students: 442 },
  { month: "يونيو", revenue: 234000, students: 510 },
  { month: "يوليو", revenue: 268000, students: 580 },
  { month: "أغسطس", revenue: 312000, students: 670 },
  { month: "سبتمبر", revenue: 425000, students: 920 },
  { month: "أكتوبر", revenue: 387000, students: 850 },
  { month: "نوفمبر", revenue: 342000, students: 765 },
  { month: "ديسمبر", revenue: 295000, students: 645 },
];

export const ENROLLMENT_BY_SUBJECT = [
  { subject: "الرياضيات", students: 2840, color: "#FFD700" },
  { subject: "اللغة العربية", students: 2420, color: "#0055A4" },
  { subject: "اللغة الإنجليزية", students: 2180, color: "#D7232E" },
  { subject: "الكيمياء", students: 1640, color: "#10B981" },
  { subject: "الفيزياء", students: 1320, color: "#7C3AED" },
  { subject: "الأحياء", students: 980, color: "#F59E0B" },
  { subject: "التاريخ", students: 580, color: "#92400E" },
  { subject: "الجغرافيا", students: 420, color: "#06B6D4" },
];

// ============ HELPERS ============
export function getCourseById(id: string): Course | undefined {
  return COURSES.find((c) => c.id === id);
}

export function getTeacherById(id: string): Teacher | undefined {
  return TEACHERS.find((t) => t.id === id);
}

export function getSubjectById(id: string): Subject | undefined {
  return SUBJECTS.find((s) => s.id === id);
}

export function getReviewsByCourse(courseId: string): Review[] {
  return REVIEWS.filter((r) => r.courseId === courseId);
}

export function getFeaturedCourses(): Course[] {
  return COURSES.filter((c) => c.isFeatured);
}

export function searchCourses(query: string, filters?: {
  subjectId?: string;
  gradeId?: string;
  level?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
}): Course[] {
  let results = COURSES;
  if (query.trim()) {
    const q = query.toLowerCase().trim();
    results = results.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.teacher.name.toLowerCase().includes(q) ||
        c.subject.name.toLowerCase().includes(q),
    );
  }
  if (filters?.subjectId) results = results.filter((c) => c.subjectId === filters.subjectId);
  if (filters?.gradeId) results = results.filter((c) => c.gradeId === filters.gradeId);
  if (filters?.level) results = results.filter((c) => c.level === filters.level);
  if (filters?.minPrice !== undefined) results = results.filter((c) => (c.discountPrice ?? c.price) >= filters.minPrice!);
  if (filters?.maxPrice !== undefined) results = results.filter((c) => (c.discountPrice ?? c.price) <= filters.maxPrice!);
  if (filters?.minRating) results = results.filter((c) => c.rating >= filters.minRating!);
  return results;
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("ar-EG", {
    style: "decimal",
    maximumFractionDigits: 0,
  }).format(price) + " ج.م";
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours} س ${minutes} د`;
  return `${minutes} د`;
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

export function formatRelativeTime(date: string): string {
  const now = Date.now();
  const past = new Date(date).getTime();
  const diff = Math.floor((now - past) / 1000);
  if (diff < 60) return "منذ ثانية";
  if (diff < 3600) return `منذ ${Math.floor(diff / 60)} دقيقة`;
  if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} ساعة`;
  if (diff < 86400 * 7) return `منذ ${Math.floor(diff / 86400)} يوم`;
  if (diff < 86400 * 30) return `منذ ${Math.floor(diff / (86400 * 7))} أسبوع`;
  return `منذ ${Math.floor(diff / (86400 * 30))} شهر`;
}
