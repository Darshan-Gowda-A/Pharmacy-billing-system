import React from 'react';

export default function MedicineRow({ med, onAdd, onEdit, onDelete, showActions = true }) {
  return (
    <tr>
      <td>
        <div style={{fontWeight:600}}>{med.name}</div>
        <div style={{fontSize:12,color:'#666'}}>{med.manufacturer}</div>
      </td>
      <td>{med.batch || '-'}</td>
      <td>{med.expiryDate ? new Date(med.expiryDate).toLocaleDateString() : '-'}</td>
      <td>₹{med.price}</td>
      <td>{med.quantity}</td>
      <td>
        {showActions && (
          <div style={{display:'flex',gap:8}}>
            <button onClick={() => onAdd && onAdd(med)} style={{padding:'6px 8px'}}>Add</button>
            <button onClick={() => onEdit && onEdit(med)} style={{padding:'6px 8px'}}>Edit</button>
            <button onClick={() => onDelete && onDelete(med)} style={{padding:'6px 8px'}}>Delete</button>
          </div>
        )}
      </td>
    </tr>
  );
}
