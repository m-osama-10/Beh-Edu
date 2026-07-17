-- Seed data only (after Prisma reset)
INSERT INTO subjects (name, name_en, icon, color, sort_order) VALUES
  ('اللغة العربية', 'Arabic', 'BookOpen', '#1A5F7A', 1),
  ('اللغة الإنجليزية', 'English', 'Languages', '#D62828', 2),
  ('الرياضيات', 'Mathematics', 'Calculator', '#FFD700', 3),
  ('الفيزياء', 'Physics', 'Atom', '#7C3AED', 4),
  ('الكيمياء', 'Chemistry', 'FlaskConical', '#10B981', 5),
  ('الأحياء', 'Biology', 'Dna', '#F59E0B', 6),
  ('التاريخ', 'History', 'ScrollText', '#92400E', 7),
  ('الجغرافيا', 'Geography', 'Globe', '#06B6D4', 8)
ON CONFLICT (name) DO NOTHING;

INSERT INTO grades (name, name_en, level, sort_order) VALUES
  ('الصف الأول الثانوي', 'Grade 1', 1, 1),
  ('الصف الثاني الثانوي', 'Grade 2', 2, 2),
  ('الصف الثالث الثانوي', 'Grade 3', 3, 3)
ON CONFLICT (name) DO NOTHING;
