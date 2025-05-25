import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
} from "react";

type UserData = {
  fullName: string;
  email: string;
  password: string;
  code: string;
};

type UserContextType = {
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: PropsWithChildren) => {
  const [userData, setUserData] = useState<UserData>({
    fullName: "",
    email: "",
    password: "",
    code: "",
  });
  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
