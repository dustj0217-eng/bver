// app/my/components/Profileheader.tsx

'use client';

import { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface ProfileHeaderProps {
  userId: string;
  name: string;
  email: string;
  onUpdate: (name: string) => void;
}

export default function ProfileHeader({
  userId,
  name,
  email,
  onUpdate,
}: ProfileHeaderProps) {
  const [editing, setEditing] = useState(false);
  const [localName, setLocalName] = useState(name);

  const handleSave = async () => {
    await setDoc(
      doc(db, 'users', userId),
      { name: localName },
      { merge: true }
    );
    onUpdate(localName);
    setEditing(false);
  };

  const handleCancel = () => {
    setLocalName(name);
    setEditing(false);
  };

  return (
    <div className="max-w-md mx-auto px-6 py-8">
      {editing ? (
        <div className="flex items-center gap-3">
          <input
            value={localName}
            onChange={(e) => setLocalName(e.target.value)}
            className="flex-1 text-2xl font-bold border-b-2 border-gray-900 pb-1 outline-none"
            autoFocus
          />
          <button
            onClick={handleSave}
            className="text-sm font-semibold text-gray-900 bg-gray-100 px-4 py-2 rounded-lg"
          >
            완료
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{name}</h1>
          <button
            onClick={() => setEditing(true)}
            className="text-sm text-gray-500"
          >
            수정
          </button>
        </div>
      )}
      <p className="text-sm text-gray-500 mt-2">{email}</p>
    </div>
  );
}