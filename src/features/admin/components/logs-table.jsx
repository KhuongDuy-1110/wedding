import React from "react";
import { Trash2 } from "lucide-react";
import { formatDate, parseUA } from "../utils/admin-helpers";

const LogsTable = ({ 
  filteredLogs, 
  selectedLogs, 
  handleBulkDeleteLogs, 
  toggleSelectAllLogs, 
  toggleSelectOneLog, 
  handleDeleteLog,
  logEventFilter,
  setLogEventFilter,
  logPathFilter,
  setLogPathFilter,
  logGuestFilter,
  setLogGuestFilter
}) => {
  const eventMap = {
    open_invitation: { label: "Mở", color: "green" },
    view_qr: { label: "QR", color: "pink" },
    page_visit: { label: "Vào", color: "blue" },
    send_wish: { label: "Chúc", color: "pink" },
    scroll_depth: { label: "Cuộn", color: "orange" },
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-50 bg-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-gray-800 text-xs sm:text-sm uppercase tracking-wider">
              Lịch sử
            </h2>
            <span className="bg-blue-50 text-blue-500 text-[10px] px-1.5 py-0.5 rounded font-bold">{filteredLogs.length}</span>
            {filteredLogs.length > 0 && (
              <label className="flex items-center gap-1.5 cursor-pointer ml-2">
                <input
                  type="checkbox"
                  checked={selectedLogs.length === filteredLogs.length && filteredLogs.length > 0}
                  onChange={toggleSelectAllLogs}
                  className="rounded border-gray-300 w-3 h-3 h-3"
                />
                <span className="text-[10px] font-bold text-gray-400 uppercase">Tất cả</span>
              </label>
            )}
          </div>
          {selectedLogs.length > 0 && (
            <button
              onClick={handleBulkDeleteLogs}
              className="flex items-center gap-1 bg-red-50 text-red-500 text-[10px] font-bold px-2 py-1 rounded border border-red-100"
            >
              <Trash2 size={12} />
              XÓA {selectedLogs.length}
            </button>
          )}
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <select
            value={logEventFilter}
            onChange={(e) => setLogEventFilter(e.target.value)}
            className="text-[10px] sm:text-xs border border-gray-100 rounded-lg px-2 py-1.5 focus:outline-none font-bold text-gray-500 bg-gray-50/50 min-w-[100px]"
          >
            <option value="all">Tất cả sự kiện</option>
            <option value="opened">Đã mở thiệp</option>
            <option value="qr">Đã xem QR</option>
            <option value="page_visit">Truy cập</option>
            <option value="scroll_depth">Cuộn trang</option>
            <option value="send_wish">Gửi lời chúc</option>
          </select>

          <select
            value={logPathFilter}
            onChange={(e) => setLogPathFilter(e.target.value)}
            className="text-[10px] sm:text-xs border border-gray-100 rounded-lg px-2 py-1.5 focus:outline-none font-bold text-gray-500 bg-gray-50/50 min-w-[100px]"
          >
            <option value="all">Tất cả nguồn</option>
            <option value="groom">Nhà trai (/r)</option>
            <option value="bride">Nhà gái (/d)</option>
          </select>

          <select
            value={logGuestFilter}
            onChange={(e) => setLogGuestFilter(e.target.value)}
            className="text-[10px] sm:text-xs border border-gray-100 rounded-lg px-2 py-1.5 focus:outline-none font-bold text-gray-500 bg-gray-50/50 min-w-[100px]"
          >
            <option value="all">Tất cả đối tượng</option>
            <option value="identified">Khách mời</option>
            <option value="anonymous">Không xác định</option>
          </select>
        </div>
      </div>

      {/* Mobile View: Log Cards */}
      <div className="sm:hidden grid grid-cols-1 gap-2 p-2 bg-gray-50/20">
        {filteredLogs.length === 0 ? (
          <div className="py-12 text-center text-gray-300 text-[11px] italic">Chưa có dữ liệu</div>
        ) : (
          filteredLogs.map((log) => {
            const ev = eventMap[log.event] || { label: log.event, color: "gray" };
            const isSide = log.path?.includes("/r") || log.path?.includes("/groom") ? "groom" : (log.path?.includes("/d") || log.path?.includes("/bride") ? "bride" : "none");
            
            return (
              <div key={log.id} className="bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center overflow-hidden">
                  <div className="flex items-center gap-1.5 overflow-hidden">
                    <input
                      type="checkbox"
                      checked={selectedLogs.includes(log.id)}
                      onChange={() => toggleSelectOneLog(log.id)}
                      className="rounded border-gray-300 w-3 h-3 shrink-0"
                    />
                    <div className="font-bold text-gray-800 text-[10px] truncate max-w-[120px]">
                      {log.guest_name || "Không xác định"}
                    </div>
                    <span className={`text-[8px] px-1 py-0.5 rounded font-bold uppercase shrink-0 ${ev.color === 'green' ? 'bg-green-50 text-green-500' : ev.color === 'pink' ? 'bg-pink-50 text-pink-500' : 'bg-gray-50 text-gray-400'}`}>
                      {ev.label}
                    </span>
                  </div>
                  <button onClick={() => handleDeleteLog(log.id)} className="text-gray-200 shrink-0"><Trash2 size={12} /></button>
                </div>
                
                <div className="flex justify-between items-center mt-1">
                  <div className="flex items-center gap-1 text-[8px] font-mono text-gray-400">
                     <span className={`px-0.5 rounded-sm font-bold ${isSide === 'groom' ? 'text-blue-400' : (isSide === 'bride' ? 'text-pink-400' : 'text-gray-300')}`}>
                       {isSide === "none" ? "CH" : (isSide === "groom" ? "R" : "D")}
                     </span>
                     <span>{formatDate(log.updated_at || log.created_at).split(' ')[1]}</span>
                     <span className="truncate max-w-[80px] opacity-70 border-l border-gray-200 pl-1.5 ml-1">{parseUA(log.user_agent)}</span>
                  </div>
                  {log.scroll_percent > 0 && (
                    <span className="text-[8px] text-orange-400 font-bold">{log.scroll_percent}%</span>
                  )}
                </div>
              </div>
            );
          })
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
                  checked={filteredLogs.length > 0 && selectedLogs.length === filteredLogs.length}
                  onChange={toggleSelectAllLogs}
                  className="rounded border-gray-300 text-primary"
                />
              </th>
              <th className="px-4 py-3 text-left">Khách mời</th>
              <th className="px-5 py-3 text-left hidden md:table-cell">Tiến độ</th>
              <th className="px-5 py-3 text-left hidden sm:table-cell">Path</th>
              <th className="px-5 py-3 text-left hidden lg:table-cell">Thiết bị</th>
              <th className="px-4 py-3 text-left">Cập nhật</th>
              <th className="px-3 py-3 text-left w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredLogs.map((log) => {
              const ev = eventMap[log.event] || { label: log.event, color: "gray" };
              const isSide = log.path?.includes("/r") || log.path?.includes("/groom") ? "groom" : (log.path?.includes("/d") || log.path?.includes("/bride") ? "bride" : "none");
              
              return (
                <tr key={log.id} className={`hover:bg-gray-50/50 transition-colors ${selectedLogs.includes(log.id) ? "bg-primary/5" : ""}`}>
                  <td className="px-3 py-4 text-center">
                    <input
                      type="checkbox"
                      checked={selectedLogs.includes(log.id)}
                      onChange={() => toggleSelectOneLog(log.id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="font-bold text-gray-800">{log.guest_name || "Không xác định"}</div>
                    <div className={`mt-1 text-[10px] w-fit font-bold uppercase px-1 rounded-sm ${ev.color === 'green' ? 'bg-green-50 text-green-600' : ev.color === 'pink' ? 'bg-pink-50 text-pink-600' : 'bg-gray-50 text-gray-400'}`}>
                       {ev.label}
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    {log.scroll_percent > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1 bg-gray-100 rounded-full overflow-hidden">
                          <div className="bg-orange-400 h-full" style={{ width: `${log.scroll_percent}%` }} />
                        </div>
                        <span className="text-xs font-bold text-orange-400">{log.scroll_percent}%</span>
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4 hidden sm:table-cell">
                    <span className={`text-[10px] font-bold px-1 rounded-sm ${isSide === 'groom' ? 'text-blue-400 bg-blue-50' : (isSide === 'bride' ? 'text-pink-400 bg-pink-50' : 'text-gray-300 bg-gray-50')}`}>
                      {isSide === "none" ? "CHUNG" : (isSide === "groom" ? "NHÀ TRAI" : "NHÀ GÁI")}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs text-gray-400 hidden lg:table-cell">{parseUA(log.user_agent)}</td>
                  <td className="px-4 py-4 text-xs text-gray-400">{formatDate(log.updated_at || log.created_at)}</td>
                  <td className="px-3 py-4 text-right">
                    <button onClick={() => handleDeleteLog(log.id)} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LogsTable;
