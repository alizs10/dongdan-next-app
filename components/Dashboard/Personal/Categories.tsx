import Button from "@/components/Common/Button";
import useStore from "@/store/store";
import { EllipsisIcon, Pencil, Plus, Tags, Trash } from "lucide-react";
import { useState } from "react";
import NewCategoryModal from "./Modals/NewCategoryModal";
import EditCategoryModal from "./Modals/EditCategoryModal";
import { Category } from "@/types/personal/category-types";
import { deleteCategoryReq } from "@/app/actions/personal/category";

const CategoryItem = ({ category, showActions, setShowActions }: { category: Category, showActions: boolean, setShowActions: (mode: boolean) => void }) => {
    const [showEditModal, setShowEditModal] = useState(false);
    const { removeCategory, addToast, openDialog, activeFilters, setActiveFilters } = useStore();

    const handleEditClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowEditModal(true);
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowActions(false);

        openDialog(
            "حذف برچسب",
            `آیا از حذف برچسب "${category.name}" اطمینان دارید؟`,
            {
                ok: {
                    text: "حذف",
                    onClick: async () => {
                        try {
                            const response = await deleteCategoryReq({ id: category.id });
                            if (response.success) {
                                removeCategory(category);
                                setShowActions(false);
                                addToast({
                                    message: 'برچسب با موفقیت حذف شد',
                                    type: 'success',
                                });
                            } else {
                                addToast({
                                    message: response.message || 'خطا در حذف برچسب',
                                    type: 'danger',
                                });
                            }
                        } catch (error) {
                            console.error('Error deleting category:', error);
                            addToast({
                                message: 'خطا در ارتباط با سرور',
                                type: 'danger',
                            });
                        }
                    }
                },
                cancel: {
                    text: "انصراف",
                    onClick: () => { }
                }
            }
        );
    };

    const isCategorySelected = activeFilters.categoryIds?.includes(category.id)

    return (
        <li
            onClick={() => setActiveFilters({ ...activeFilters, categoryIds: [category.id] })}
            className="cursor-pointer">
            <div className={`${isCategorySelected ? 'primary_text_color bg-indigo-900/20 dark:bg-indigo-600/20' : ''} w-full text-right py-2 px-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex justify-between items-center`}>
                <span className="text-sm">{category.name}</span>
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
                        <span className={`${isCategorySelected ? 'primary_text_color' : 'text-gray-500 dark:text-gray-400'} text-sm`}>{category.transaction_count ?? '0'}</span>
                    )}
                </div>
            </div>

            {showEditModal && (
                <EditCategoryModal
                    onClose={() => {
                        setShowActions(false);
                        setShowEditModal(false);
                    }}
                    category={category}
                />
            )}
        </li>
    );
};

const Categories = () => {
    const { categories, activeFilters, setActiveFilters } = useStore();
    // Calculate total transactions count from categories
    const totalTransactionsCount = categories.reduce((total, category) => {
        return total + (category.transaction_count || 0);
    }, 0);
    const [newCategoryModalVis, setNewCategoryModalVis] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const toggleEditMode = () => {
        setEditMode(prevState => !prevState);
    };

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
                <ul className="">
                    <li
                        onClick={() => setActiveFilters({ ...activeFilters, categoryIds: [] })}
                        className="cursor-pointer"
                    >
                        <div className={`${activeFilters.categoryIds?.length === 0 ? 'primary_text_color bg-indigo-900/20 dark:bg-indigo-600/20' : ''} w-full text-right py-2 px-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex justify-between items-center`}>
                            <span className="text-sm">همه</span>
                            <div className="flex items-center">
                                <span className={`${activeFilters.categoryIds?.length === 0 ? 'primary_text_color' : 'text-gray-500 dark:text-gray-400'} text-sm`}>{totalTransactionsCount}</span>

                            </div>
                        </div>
                    </li>
                    {categories.map((category) => (
                        <CategoryItem key={category.id} category={category} showActions={editMode} setShowActions={setEditMode} />
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Categories;
