import React from "react";
import { Trash2, MessageSquare } from "lucide-react";
import { formatDate } from "../utils/admin-helpers";

const WishesTable = ({
  filteredWishes,
  selectedWishes,
  toggleSelectOne,
  toggleSelectAll,
  handleDelete,
  handleBulkDelete,
  wishFilter,
  setWishFilter,
  wishSort,
  setWishSort
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-50 bg-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-gray-800 text-xs sm:text-sm uppercase tracking-wider">
              Lời chúc
            </h2>
            <span className="bg-pink-50 text-pink-500 text-[10px] px-1.5 py-0.5 rounded font-bold">{filteredWishes.length}</span>
            {filteredWishes.length > 0 && (
              <label className="flex items-center gap-1.5 cursor-pointer ml-2">
                <input
                  type="checkbox"
                  checked={selectedWishes.length === filteredWishes.length && filteredWishes.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded border-gray-300 w-3 h-3"
                />
                <span className="text-[10px] font-bold text-gray-400 uppercase">Tất cả</span>
              </label>
            )}
          </div>
          {selectedWishes.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-1 bg-red-50 text-red-500 text-[10px] font-bold px-2 py-1 rounded border border-red-100"
            >
              <Trash2 size={12} />
              XÓA {selectedWishes.length}
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <input
            type="text"
            value={wishFilter}
            onChange={(e) => setWishFilter(e.target.value)}
            placeholder="Tìm tên khách..."
            className="text-[10px] sm:text-xs border border-gray-100 rounded-lg px-2 py-1.5 focus:outline-none font-bold text-gray-500 bg-gray-50/50 min-w-[120px]"
          />
          <select
             value={wishSort}
             onChange={(e) => setWishSort(e.target.value)}
             className="text-[10px] sm:text-xs border border-gray-100 rounded-lg px-2 py-1.5 focus:outline-none font-bold text-gray-500 bg-gray-50/50"
          >
            <option value="desc">Mới nhất</option>
            <option value="asc">Cũ nhất</option>
          </select>
        </div>
      </div>

      {/* Mobile View: Wish Cards */}
      <div className="sm:hidden grid grid-cols-1 gap-2 p-2 bg-gray-50/20 text-xs">
        {filteredWishes.length === 0 ? (
          <div className="py-12 text-center text-gray-300 text-[10px] italic leading-tight">
             {wishFilter ? "Không tìm thấy" : "Trống"}
          </div>
        ) : (
          filteredWishes.map((wish) => (
            <div key={wish.id} className="bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between gap-2 overflow-hidden">
                 <div className="flex items-center gap-1.5 overflow-hidden">
                   <input
                      type="checkbox"
                      checked={selectedWishes.includes(wish.id)}
                      onChange={() => toggleSelectOne(wish.id)}
                      className="rounded border-gray-300 w-3 h-3 shrink-0"
                    />
                    <div className="flex items-baseline gap-1.5 overflow-hidden">
                      <span className="font-bold text-gray-800 text-[10px] shrink-0">{wish.name}</span>
                      <span className="text-gray-400 text-[10px] italic">"{wish.message}"</span>
                    </div>
                 </div>
                 <button onClick={() => handleDelete(wish.id)} className="text-rose-200 hover:text-rose-500 shrink-0"><Trash2 size={12} /></button>
              </div>
              
              <div className="flex justify-between items-center mt-1">
                 <div className="flex items-center gap-2">
                   <span className="text-[8px] text-gray-300 font-mono">{formatDate(wish.created_at)}</span>
                 </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop View: Table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-[11px] text-gray-400 uppercase tracking-wider">
              <th className="px-3 py-3 text-left w-10">
                <input
                  type="checkbox"
                  checked={filteredWishes.length > 0 && selectedWishes.length === filteredWishes.length}
                  onChange={toggleSelectAll}
                  className="rounded border-gray-300"
                />
              </th>
              <th className="px-6 py-3 text-left">Người gửi</th>
              <th className="px-6 py-3 text-left">Phía</th>
              <th className="px-6 py-3 text-left">Lời chúc</th>
              <th className="px-6 py-3 text-left">Ngày gửi</th>
              <th className="px-6 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredWishes.map((wish) => (
              <tr key={wish.id} className={`hover:bg-gray-50 transition-colors ${selectedWishes.includes(wish.id) ? "bg-primary/5" : ""}`}>
                <td className="px-3 py-4 text-center">
                  <input
                    type="checkbox"
                    checked={selectedWishes.includes(wish.id)}
                    onChange={() => toggleSelectOne(wish.id)}
                    className="rounded border-gray-300"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-800">{wish.name}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    {wish.guest_path_name?.includes("/k") || wish.guest_path_name?.includes("groom") ? (
                      <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded w-fit">CHÚ RỂ</span>
                    ) : wish.guest_path_name?.includes("/g") || wish.guest_path_name?.includes("bride") ? (
                      <span className="text-[10px] font-bold text-pink-500 bg-pink-50 px-1.5 py-0.5 rounded w-fit">CÔ DÂU</span>
                    ) : (
                      <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded w-fit uppercase">{wish.guest_path_name || "Chung"}</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-xs text-gray-500 max-w-xs">{wish.message}</td>
                <td className="px-6 py-4 text-xs text-gray-400">{formatDate(wish.created_at)}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => handleDelete(wish.id)} className="p-2 text-rose-300 bg-rose-50 rounded-lg hover:text-rose-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WishesTable;
