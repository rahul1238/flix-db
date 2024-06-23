import { Endpoints } from "@/lib/enums/endpoints";
import { apiService } from "@/lib/services/api";
import { User } from "@/types/movies";
import React, { PropsWithChildren, createContext, useContext, useEffect, useState } from "react"

type NullableUser = User | null;

type ContextType = {
    user: NullableUser;
    setUser: React.Dispatch<React.SetStateAction<NullableUser>>;
}

export default function UserProvider({ children }: PropsWithChildren) {
    const [user, setUser] = useState<NullableUser>(null);
    useEffect(() => {
        if (localStorage.getItem('token') === null) return;
        apiService.get(Endpoints.PROFILE)
            .then(({ data }) => {
                setUser(data as User);
                console.log(data)
            })
            .catch((e) => {
                console.log(e)
                setUser(null);
            })
    }, [])
    return (
        <userContext.Provider value={{ user, setUser }}>
            {children}
        </userContext.Provider>
    )
}

const userContext = createContext<ContextType>({ user: null, setUser: () => { } });

export const useUser = () => {
    return useContext(userContext);
} 