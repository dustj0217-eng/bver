// app/my/components/ShippingSection.tsx

'use client';

import { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import EmptyState from './EmptyState';

export interface ShippingAddress {
  name: string;
  phone: string;
  zipcode: string;
  address: string;
  addressDetail: string;
  isDefault?: boolean;
}

interface ShippingSectionProps {
  userId: string;
  shippingInfo: ShippingAddress;
  onUpdate: (info: ShippingAddress) => void;
}

export default function ShippingSection({
  userId,
  shippingInfo,
  onUpdate,
}: ShippingSectionProps) {
  const [editingShipping, setEditingShipping] = useState(false);
  const [localInfo, setLocalInfo] = useState(shippingInfo);

  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: (data: any) => {
        setLocalInfo(prev => ({
          ...prev,
          zipcode: data.zonecode,
          address: data.address,
        }));
      },
    }).open();
  };

  const handleSave = async () => {
    await setDoc(
      doc(db, 'users', userId),
      { shippingAddress: localInfo },
      { merge: true }
    );
    onUpdate(localInfo);
    setEditingShipping(false);
  };

  const handleCancel = () => {
    setLocalInfo(shippingInfo);
    setEditingShipping(false);
  };

  const hasShippingInfo = shippingInfo.name && shippingInfo.phone && shippingInfo.address;

  if (editingShipping) {
    return (
      <div className="space-y-4 pt-2">
        <div>
          <label className="text-xs text-gray-500 block mb-1">받는 분</label>
          <input
            type="text"
            value={localInfo.name}
            onChange={(e) => setLocalInfo(prev => ({ ...prev, name: e.target.value }))}
            placeholder="이름을 입력하세요"
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm"
          />
        </div>
        
        <div>
          <label className="text-xs text-gray-500 block mb-1">연락처</label>
          <input
            type="tel"
            value={localInfo.phone}
            onChange={(e) => setLocalInfo(prev => ({ ...prev, phone: e.target.value }))}
            placeholder="010-0000-0000"
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm"
          />
        </div>

        <div>
          <label className="text-xs text-gray-500 block mb-1">우편번호</label>
          <input
            type="text"
            value={localInfo.zipcode}
            readOnly
            placeholder="우편번호"
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-gray-50"
          />
          <button 
            type="button"
            onClick={handleAddressSearch}
            className="mt-2 w-full px-4 py-3 bg-gray-100 rounded-lg text-sm font-medium"
          >
            주소 검색
          </button>
        </div>

        <div>
          <label className="text-xs text-gray-500 block mb-1">주소</label>
          <input
            type="text"
            value={localInfo.address}
            readOnly
            placeholder="기본 주소"
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm mb-2 bg-gray-50"
          />
          <input
            type="text"
            value={localInfo.addressDetail}
            onChange={(e) => setLocalInfo(prev => ({ ...prev, addressDetail: e.target.value }))}
            placeholder="상세 주소"
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm"
          />
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={handleCancel}
            className="flex-1 py-3 bg-gray-100 rounded-lg text-sm font-medium"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 bg-gray-900 text-white rounded-lg text-sm font-medium"
          >
            저장
          </button>
        </div>
      </div>
    );
  }

  if (hasShippingInfo) {
    return (
      <div className="pt-2">
        <div className="bg-gray-50 rounded-lg p-4 mb-3">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-semibold">{shippingInfo.name}</p>
            <span className="text-xs bg-gray-900 text-white px-2 py-0.5 rounded">
              기본 배송지
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-1">{shippingInfo.phone}</p>
          <p className="text-sm text-gray-600">
            ({shippingInfo.zipcode}) {shippingInfo.address}
          </p>
          {shippingInfo.addressDetail && (
            <p className="text-sm text-gray-600">{shippingInfo.addressDetail}</p>
          )}
        </div>
        <button
          onClick={() => setEditingShipping(true)}
          className="w-full py-3 border border-gray-200 rounded-lg text-sm font-medium"
        >
          배송지 수정
        </button>
      </div>
    );
  }

  return (
    <div className="pt-2">
      <EmptyState 
        text="등록된 배송지가 없습니다" 
        subtext="배송지를 등록하고 빠르게 주문하세요"
      />
      <button
        onClick={() => setEditingShipping(true)}
        className="w-full py-3 bg-gray-900 text-white rounded-lg text-sm font-medium mt-4"
      >
        배송지 등록
      </button>
    </div>
  );
}