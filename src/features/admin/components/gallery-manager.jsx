import React from "react";
import { Trash2, Image as ImageIcon, CheckSquare, Upload, RefreshCw } from "lucide-react";

const GalleryManager = ({
  galleryList = [],
  selectedIndices = [],
  toggleSelect,
  handleDeleteGallery,
  handleDeleteSelected,
  toggleSelectAll,
  uploading,
  handleUpload
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-gray-800 text-xs sm:text-sm uppercase tracking-wider">
            Album Ảnh
          </h2>
          <span className="bg-purple-50 text-purple-500 text-[10px] px-1.5 py-0.5 rounded font-bold">{galleryList.length} ảnh</span>
        </div>

        <div className="flex items-center gap-2">
          {galleryList.length > 0 && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={toggleSelectAll}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-500 hover:bg-gray-100 rounded-lg transition-all text-[11px] font-bold border border-gray-100"
              >
                {selectedIndices.length === galleryList.length ? "Bỏ chọn" : "Chọn tất cả"}
              </button>
              {selectedIndices.length > 0 && (
                <button
                  onClick={handleDeleteSelected}
                  className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-all text-[11px] font-bold border border-red-100"
                >
                  <Trash2 size={14} /> XÓA {selectedIndices.length}
                </button>
              )}
            </div>
          )}

          <label className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-[11px] font-bold rounded-lg cursor-pointer hover:bg-primary/90 transition-all shadow-md shadow-primary/10">
            <input
              type="file"
              className="hidden"
              accept="image/*"
              multiple
              onChange={(e) => handleUpload(e, null, true)}
              disabled={uploading === "new_gallery"}
            />
            {uploading === "new_gallery" ? (
              <RefreshCw className="animate-spin" size={12} />
            ) : (
              <Upload size={12} />
            )}
            <span className="sm:inline hidden">THÊM NHIỀU ẢNH</span>
            <span className="sm:hidden">THÊM ẢNH</span>
          </label>
        </div>
      </div>

      <div className="p-2 sm:p-4">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-4 font-bold">
          {galleryList.map((url, index) => (
            <div
              key={index}
              className={`bg-white rounded-lg p-0.5 shadow-sm border transition-all group relative cursor-pointer ${
                selectedIndices.includes(index)
                  ? "border-primary ring-2 ring-primary/10 shadow-sm"
                  : "border-gray-100"
              }`}
              onClick={() => toggleSelect(index)}
            >
              <div className="aspect-square rounded-md overflow-hidden relative border border-gray-50">
                <img
                  src={url}
                  alt={`Gallery ${index}`}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                />

                <div className="absolute top-1 right-1 flex flex-col gap-1 items-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteGallery(index);
                    }}
                    className="p-1 bg-red-100/90 text-red-600 rounded opacity-0 group-hover:opacity-100 transition-all sm:opacity-0"
                  >
                    <Trash2 size={10} />
                  </button>
                  <div
                    className={`p-0.5 rounded transition-all ${
                      selectedIndices.includes(index)
                        ? "bg-primary text-white"
                        : "bg-white/80 text-gray-400 opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    <CheckSquare size={12} />
                  </div>
                </div>

                {selectedIndices.includes(index) && (
                  <div className="absolute inset-0 bg-primary/10 transition-all pointer-events-none" />
                )}
              </div>
            </div>
          ))}
          {galleryList.length === 0 && (
            <div className="col-span-full py-8 text-center border border-dashed border-gray-100 rounded-2xl">
              <p className="text-gray-300 text-[10px] font-medium uppercase tracking-widest leading-loose">Album trống</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GalleryManager;
