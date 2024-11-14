import { useState, useEffect } from "react";
import useAuth from "../store/authStore";
import { getUser } from "../functions/userQueries";
import { Avatar } from "@mui/joy";

const UserIcon = ({ height, width, bgcolor }) => {
    const { session } = useAuth();
    const [user, setUser] = useState([]);
  
    useEffect(() => {
      if (session) {
        fetchUser();
      }
    }, [session]);
  
    const fetchUser = async () => {
      try {
        const data = await getUser(session.user.id);
        setUser(data);
        
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser([]);
      }
    };

    const firstInitial = user[0]?.first_name ? user[0].first_name[0] : "";
    const lastInitial = user[0]?.last_name ? user[0].last_name[0] : "";

    return (
        <Avatar
            sx={{
                bgcolor: bgcolor ? bgcolor : 'neutral',
                width: width,
                height: height,
                fontSize: '1.25rem',
                fontWeight: 'bold',
                variant:"soft",
                
            }}
        >
            {firstInitial}{lastInitial}
        </Avatar>
    );
}
export default UserIcon;