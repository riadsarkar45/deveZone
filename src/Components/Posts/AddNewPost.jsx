import { Editor } from "@tinymce/tinymce-react";
import { useContext, useState } from "react";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { AuthContext } from "../../Auth/AuthProvider/AuthProvider";
import { useQuery } from "@tanstack/react-query";

const AddNewPost = () => {
    const [content, setEditorContent] = useState('');
    const [category, setCategory] = useState('')
    const [title, setTitle] = useState('')
    const [categories, setCategories] = useState([])
    const axiosPublic = useAxiosPublic();
    const { user } = useContext(AuthContext);

    const { refetch } = useQuery({
        queryKey: ["posts"],
        queryFn: async () => {
            try {
                const res = await axiosPublic.get(`/all-topics`);
                setCategories(res.data)
                return res.data;
            } catch (error) {
                console.error("Error fetching posts:", error);
                return null;
            }
        },
    })

    const handleEditorChange = (content) => {
        setEditorContent(content);
    };

    const handleGetCategory = (category) => {
        setCategory(category)
    }

    const handleGetTitle = (title) => {
        setTitle(title)
    }

    const handleAddNewPost = (e) => {
        e.preventDefault();
        const dataToInsert = { posterName: user?.email, uid: user?.uid, content, title, category, likerIds: [], totalComment: 0, likes: 0 }
        axiosPublic.post('/addNewPost', dataToInsert)
            .then(() => {
                refetch()
                setTitle('')
                setEditorContent('')
            })
    }


    return (
        <div className="w-[85%] m-auto mt-[3rem]">
            <form onSubmit={handleAddNewPost}>
                <div className="flex w-full mb-3 gap-2">
                    <input onChange={e => handleGetTitle(e.target.value)} type="text" className="input input-bordered grow w-full" placeholder="Daisy" />
                    <select defaultValue={category} onChange={e => handleGetCategory(e.target.value)} className="select select-bordered w-full ">
                        <option defaultValue="Select Category">Select Category</option>
                        {
                            categories?.map((cat, i) => <option key={i}>{cat.name}</option>)
                        }
                    </select>
                </div>
                <Editor
                    apiKey='brikvuf0gy448p1w18panj2l355px1mxwasvo2zjftoe04wj'
                    init={{
                        plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage advtemplate ai mentions tinycomments tableofcontents footnotes mergetags autocorrect typography inlinecss',
                        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                    }}
                    onEditorChange={handleEditorChange}
                    initialValue="Welcome to TinyMCE!"
                />
                <div className="text-center mt-3">
                    <button className="btn btn-primary btn-md">Publish</button>
                </div>
            </form>
        </div>
    );
};

export default AddNewPost;