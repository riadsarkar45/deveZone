import Topics from "./Topics";

const AllTopics = () => {
    const [percentage, setPercentage] = useState(0)
    const [categories, setCategories] = useState([])
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [suggestions] = useState([])
    const { refetch } = useQuery({
        queryKey: ["posts"],
        queryFn: async () => {
            try {
                const res = await axiosPublic.get(`/categories`);
                setCategories(res.data)
                return res.data;
            } catch (error) {
                console.error("Error fetching posts:", error);
                return null;
            }
        },
    })

    const toggleTagSelection = (tag) => {
        if (selectedCategory.includes(tag)) {
            setSelectedCategory(selectedCategory.filter(selectedTag => selectedTag !== tag));
        } else {
            setSelectedCategory([...selectedCategory, tag]);
        }
    };
    return (
        <div>
            <Topics></Topics>
        </div>
    );
};

export default AllTopics;