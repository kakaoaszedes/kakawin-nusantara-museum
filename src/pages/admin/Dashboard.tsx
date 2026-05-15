import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  LogOut,
  Database,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Search,
} from "lucide-react";

import { Button } from "../../components/ui/Button";
import { supabase } from "../../lib/supabase";

import UploadModal from "../../components/admin/UploadModal";
import EditModal from "../../components/admin/EditModal";

import {
  getAllDocuments,
  updateDocumentById,
  deleteDocumentById,
} from "../../services/db";

export default function Dashboard() {
  const navigate = useNavigate();

  // =========================
  // STATE
  // =========================
  const [user, setUser] = useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  const [contents, setContents] =
    useState<any[]>([]);

  const [
    uploadModalOpen,
    setUploadModalOpen,
  ] = useState(false);

  const [editingItem, setEditingItem] =
    useState<any>(null);

  const [editModalOpen, setEditModalOpen] =
    useState(false);

  const [search, setSearch] =
    useState("");

  // =========================
  // INIT
  // =========================
  useEffect(() => {
    checkUser();
    loadContents();
  }, []);

  // =========================
  // CHECK USER
  // =========================
  const checkUser = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/admin");
        return;
      }

      setUser(user);
    } catch (error) {
      console.error(
        "Check user error:",
        error
      );
    }
  };

  // =========================
  // LOAD CONTENTS
  // =========================
  const loadContents = async () => {
    try {
      setLoading(true);

      const data =
        await getAllDocuments<any>(
          "contents"
        );

      setContents(data || []);
    } catch (error) {
      console.error(
        "Load contents error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // EDIT
  // =========================
  const handleEdit = (
    item: any
  ) => {
    setEditingItem(item);
    setEditModalOpen(true);
  };

  // =========================
  // DELETE
  // =========================
  const handleDelete = async (
    id: string
  ) => {
    const confirmDelete = confirm(
      "Yakin ingin menghapus konten ini?"
    );

    if (!confirmDelete) return;

    try {
      const success =
        await deleteDocumentById(
          "contents",
          id
        );

      if (success) {
        setContents((prev) =>
          prev.filter(
            (item) => item.id !== id
          )
        );
      }
    } catch (error) {
      console.error(
        "Delete error:",
        error
      );
    }
  };

  // =========================
  // TOGGLE PUBLISH
  // =========================
  const handleToggleVisibility =
    async (item: any) => {
      try {
        const updated =
          await updateDocumentById(
            "contents",
            item.id,
            {
              is_published:
                !item.is_published,
            }
          );

        if (updated) {
          setContents((prev) =>
            prev.map((content) =>
              content.id === item.id
                ? {
                    ...content,
                    is_published:
                      !content.is_published,
                  }
                : content
            )
          );
        }
      } catch (error) {
        console.error(
          "Toggle visibility error:",
          error
        );
      }
    };

  // =========================
  // LOGOUT
  // =========================
  const handleLogout =
    async () => {
      await supabase.auth.signOut();
      navigate("/admin");
    };

  // =========================
  // AFTER UPLOAD
  // =========================
  const handleUploadSuccess =
    async () => {
      await loadContents();
    };

  // =========================
  // FILTERED DATA
  // =========================
  const filteredContents =
    useMemo(() => {
      return contents.filter(
        (item) => {
          const title =
            item.title?.toLowerCase() ||
            "";

          const desc =
            item.description?.toLowerCase() ||
            "";

          const category =
            item.category?.toLowerCase() ||
            "";

          const keyword =
            search.toLowerCase();

          return (
            title.includes(keyword) ||
            desc.includes(keyword) ||
            category.includes(keyword)
          );
        }
      );
    }, [contents, search]);

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="min-h-screen bg-matte-black p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map(
              (_, i) => (
                <div
                  key={i}
                  className="h-72 rounded-2xl bg-white/5 animate-pulse"
                />
              )
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-matte-black p-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-cinzel text-gold-elegant mb-2">
              Admin Dashboard
            </h1>

            <p className="text-cream/50">
              Welcome back,{" "}
              {user?.email}
            </p>
          </div>

          <Button
            onClick={handleLogout}
            variant="outline"
            className="gap-2"
          >
            <LogOut size={16} />
            Logout
          </Button>
        </header>

        {/* MAIN */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* SIDEBAR */}
          <div className="space-y-4">
            <div className="glass rounded-2xl p-4 border border-white/10">
              <div className="space-y-3">

                <Button className="w-full justify-start gap-2">
                  <LayoutDashboard size={18} />
                  Dashboard
                </Button>

                <Button className="w-full justify-start gap-2">
                  <Database size={18} />
                  All Contents
                </Button>

                <Button
                  onClick={() =>
                    setUploadModalOpen(
                      true
                    )
                  }
                  className="w-full justify-start gap-2"
                >
                  <Plus size={18} />
                  Upload Content
                </Button>

              </div>
            </div>
          </div>

          {/* CONTENT */}
          <div className="lg:col-span-3">

            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

              <div className="glass rounded-2xl p-5 border border-white/10">
                <p className="text-sm text-cream/50">
                  Total Content
                </p>

                <h2 className="text-3xl font-bold text-white mt-2">
                  {contents.length}
                </h2>
              </div>

              <div className="glass rounded-2xl p-5 border border-white/10">
                <p className="text-sm text-cream/50">
                  Published
                </p>

                <h2 className="text-3xl font-bold text-green-400 mt-2">
                  {
                    contents.filter(
                      (item) =>
                        item.is_published
                    ).length
                  }
                </h2>
              </div>

              <div className="glass rounded-2xl p-5 border border-white/10">
                <p className="text-sm text-cream/50">
                  Draft
                </p>

                <h2 className="text-3xl font-bold text-yellow-400 mt-2">
                  {
                    contents.filter(
                      (item) =>
                        !item.is_published
                    ).length
                  }
                </h2>
              </div>

            </div>

            {/* SEARCH */}
            <div className="relative mb-6">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/40"
              />

              <input
                type="text"
                placeholder="Search content..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                className="w-full bg-black/30 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white outline-none focus:border-gold-elegant/50"
              />
            </div>

            {/* EMPTY */}
            {filteredContents.length ===
              0 && (
              <div className="glass rounded-2xl p-10 text-center border border-white/10">
                <p className="text-cream/50">
                  Belum ada konten.
                </p>
              </div>
            )}

            {/* CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

              {filteredContents.map(
                (item) => (
                  <div
                    key={item.id}
                    className="glass rounded-2xl overflow-hidden border border-white/10 hover:border-gold-elegant/40 transition-all"
                  >

                    {/* IMAGE */}
                    <div className="h-48 bg-white/5">

                      {item.thumbnail ? (
                        <img
                          src={
                            item.thumbnail
                          }
                          alt={
                            item.title
                          }
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-cream/30">
                          No Image
                        </div>
                      )}

                    </div>

                    {/* BODY */}
                    <div className="p-5">

                      <div className="flex items-center justify-between mb-3">

                        <span className="text-xs px-3 py-1 rounded-full bg-gold-elegant/20 text-gold-elegant capitalize">
                          {item.category ||
                            "Content"}
                        </span>

                        <button
                          onClick={() =>
                            handleToggleVisibility(
                              item
                            )
                          }
                          className="text-cream/60 hover:text-white"
                        >
                          {item.is_published ? (
                            <Eye size={18} />
                          ) : (
                            <EyeOff size={18} />
                          )}
                        </button>

                      </div>

                      <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">
                        {item.title}
                      </h3>

                      {/* FIX TIPTAP HTML */}
                      <div
                        className="text-sm text-cream/60 line-clamp-3 prose prose-invert max-w-none"
                        dangerouslySetInnerHTML={{
                          __html:
                            item.description ||
                            "",
                        }}
                      />

                      <div className="flex gap-2 mt-5">

                        <Button
                          onClick={() =>
                            handleEdit(
                              item
                            )
                          }
                          className="flex-1 gap-2"
                        >
                          <Edit size={16} />
                          Edit
                        </Button>

                        <Button
                          variant="outline"
                          onClick={() =>
                            handleDelete(
                              item.id
                            )
                          }
                          className="flex-1 gap-2 border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                        >
                          <Trash2 size={16} />
                          Delete
                        </Button>

                      </div>

                    </div>

                  </div>
                )
              )}

            </div>

          </div>

        </div>

      </div>

      {/* UPLOAD MODAL */}
      <UploadModal
        isOpen={uploadModalOpen}
        onClose={() =>
          setUploadModalOpen(false)
        }
        onSuccess={
          handleUploadSuccess
        }
      />

      {/* EDIT MODAL */}
      {editModalOpen &&
        editingItem && (
          <EditModal
            item={editingItem}
            isOpen={
              editModalOpen
            }
            onClose={() => {
              setEditModalOpen(
                false
              );

              setEditingItem(
                null
              );
            }}
            onSuccess={() => {
              loadContents();

              setEditModalOpen(
                false
              );

              setEditingItem(
                null
              );
            }}
          />
        )}

    </div>
  );
}
