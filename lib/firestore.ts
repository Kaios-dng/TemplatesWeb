import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { firestoreDb, firebaseStorage } from "@/lib/firebase";
import { seedCategories, seedTemplates } from "@/lib/seed";
import {
  Category,
  Inquiry,
  InquiryInput,
  TemplateDraft,
  TemplateRecord,
} from "@/lib/types";

function requireDb() {
  if (!firestoreDb) {
    throw new Error("FIREBASE_NOT_CONFIGURED");
  }
  return firestoreDb;
}

export async function getCategories(): Promise<Category[]> {
  if (!firestoreDb) return seedCategories;
  const result = await getDocs(
    query(
      collection(firestoreDb, "categories"),
      where("active", "==", true),
      orderBy("order", "asc"),
    ),
  );
  const categories = result.docs.map(
    (item) => ({ id: item.id, ...item.data() }) as Category,
  );
  return categories.length ? categories : seedCategories;
}

export async function getPublishedTemplates(): Promise<TemplateRecord[]> {
  if (!firestoreDb) return seedTemplates;
  const result = await getDocs(
    query(
      collection(firestoreDb, "templates"),
      where("published", "==", true),
      orderBy("updatedAt", "desc"),
    ),
  );
  return result.docs.map(
    (item) => ({ id: item.id, ...item.data() }) as TemplateRecord,
  );
}

export async function getTemplateBySlug(
  slug: string,
): Promise<TemplateRecord | null> {
  if (!firestoreDb) {
    return seedTemplates.find((item) => item.slug === slug) ?? null;
  }
  const result = await getDocs(
    query(
      collection(firestoreDb, "templates"),
      where("slug", "==", slug),
      where("published", "==", true),
      limit(1),
    ),
  );
  const item = result.docs[0];
  return item ? ({ id: item.id, ...item.data() } as TemplateRecord) : null;
}

export async function getTemplateById(
  id: string,
): Promise<TemplateRecord | null> {
  const db = requireDb();
  const result = await getDoc(doc(db, "templates", id));
  return result.exists()
    ? ({ id: result.id, ...result.data() } as TemplateRecord)
    : null;
}

export function subscribeToTemplates(
  onData: (items: TemplateRecord[]) => void,
  onError: (error: Error) => void,
) {
  if (!firestoreDb) {
    onData(seedTemplates);
    return () => undefined;
  }
  return onSnapshot(
    query(collection(firestoreDb, "templates"), orderBy("updatedAt", "desc")),
    (snapshot) =>
      onData(
        snapshot.docs.map(
          (item) => ({ id: item.id, ...item.data() }) as TemplateRecord,
        ),
      ),
    (error) => onError(error),
  );
}

export function subscribeToInquiries(
  onData: (items: Inquiry[]) => void,
  onError: (error: Error) => void,
) {
  if (!firestoreDb) {
    onData([]);
    return () => undefined;
  }
  return onSnapshot(
    query(collection(firestoreDb, "inquiries"), orderBy("createdAt", "desc")),
    (snapshot) =>
      onData(
        snapshot.docs.map(
          (item) => ({ id: item.id, ...item.data() }) as Inquiry,
        ),
      ),
    (error) => onError(error),
  );
}

export async function createInquiry(input: InquiryInput) {
  const db = requireDb();
  return addDoc(collection(db, "inquiries"), {
    ...input,
    status: "new",
    createdAt: serverTimestamp(),
  });
}

export async function saveTemplate(
  draft: TemplateDraft,
  id?: string,
): Promise<string> {
  const db = requireDb();
  if (id) {
    await setDoc(
      doc(db, "templates", id),
      { ...draft, updatedAt: serverTimestamp() },
      { merge: true },
    );
    return id;
  }
  const result = await addDoc(collection(db, "templates"), {
    ...draft,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return result.id;
}

export async function removeTemplate(id: string) {
  await deleteDoc(doc(requireDb(), "templates", id));
}

export async function updateInquiryStatus(
  id: string,
  status: Inquiry["status"],
) {
  await updateDoc(doc(requireDb(), "inquiries", id), { status });
}

export async function uploadTemplateImage(
  templateId: string,
  file: File,
  onProgress: (progress: number) => void,
): Promise<string> {
  if (!firebaseStorage) throw new Error("FIREBASE_NOT_CONFIGURED");
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const target = ref(
    firebaseStorage,
    `templates/${templateId}/${Date.now()}-${safeName}`,
  );
  const task = uploadBytesResumable(target, file, {
    contentType: file.type,
    cacheControl: "public,max-age=31536000,immutable",
  });
  return new Promise((resolve, reject) => {
    task.on(
      "state_changed",
      (snapshot) =>
        onProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100),
      reject,
      async () => resolve(await getDownloadURL(task.snapshot.ref)),
    );
  });
}

