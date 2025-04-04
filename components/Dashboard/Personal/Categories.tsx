import Button from "@/components/Common/Button";
import useStore from "@/store/store";
import { EllipsisIcon, Pencil, Plus, Tags, Trash } from "lucide-react";
import { useState } from "react";
import NewCategoryModal from "./Modals/NewCategoryModal";
import EditCategoryModal from "./Modals/EditCategoryModal";
import ConfirmDialog from "./Modals/ConfirmDialog";
import { Category } from "@/types/personal/category-types";

const CategoryItem = ({ category, showActions }: { category: Category, showActions: boolean }) => {
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const { removeCategory } = useStore();

    const handleEditClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        // setShowActions(false);
        setShowEditModal(true);
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        // setShowActions(false);
        setShowDeleteConfirm(true);
    };

    const handleDeleteConfirm = () => {
        removeCategory(category);
        setShowDeleteConfirm(false);
    };

    // const toggleActions = (e: React.MouseEvent) => {
    //     e.stopPropagation();
    //     setShowActions(!showActions);
    // };

    return (
        <li>
            <div className="w-full text-right py-2 px-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex justify-between items-center">
                {category.name}
                <div className="flex items-center">
                    {showActions ? (
                        <div className="flex gap-2">
                            <button
                                onClick={handleEditClick}
                                className="text-gray-500 dark:text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-300 p-1"
                            >
                                <Pencil className="size-4" />
                            </button>
                            <button
                                onClick={handleDeleteClick}
                                className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 p-1"
                            >
                                <Trash className="size-4" />
                            </button>
                        </div>
                    ) : (
                        <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">0</span>
                    )}
                </div>
            </div>

            {showEditModal && (
                <EditCategoryModal
                    onClose={() => setShowEditModal(false)}
                    category={category}
                />
            )}

            {showDeleteConfirm && (
                <ConfirmDialog
                    title="حذف برچسب"
                    message={`آیا از حذف برچسب "${category.name}" اطمینان دارید؟`}
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setShowDeleteConfirm(false)}
                />
            )}
        </li>
    );
};

const Categories = () => {
    const { categories } = useStore();
    const [newCategoryModalVis, setNewCategoryModalVis] = useState(false);
    const [editMode, setEditMode] = useState(false)
    const toggleEditMode = () => {
        setEditMode(prevState => !prevState)
    }

    return (
        <div className="mb-6">
            <div className="flex flex-row justify-between items-center px-6 pt-6 mb-4">
                <div className="flex items-center gap-2 text-lg font-semibold primary_text_color">
                    <Tags className="size-5" />
                    <h3>برچسب‌ها</h3>
                </div>
                <div className="flex flex-row items-center gap-x-2">
                    <button
                        onClick={toggleEditMode}
                        className="text-gray-500">
                        <EllipsisIcon className="size-4" />
                    </button>

                    <Button
                        icon={<Plus className="size-4" />}
                        size="small"
                        color="accent"
                        onClick={() => setNewCategoryModalVis(true)}
                        text=""
                    />
                </div>

                {newCategoryModalVis && (<NewCategoryModal onClose={() => setNewCategoryModalVis(false)} />)}
            </div>

            {categories.length === 0 ? (
                <p className="py-4 text-gray-500 dark:text-gray-400 text-center">اولین برچسب رو اضافه کن</p>
            ) : (
                <ul className="space-y-2">
                    {categories.map((category) => (
                        <CategoryItem key={category.id} category={category} showActions={editMode} />
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Categories;
