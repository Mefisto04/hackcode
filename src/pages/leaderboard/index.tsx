import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "@/firebase/firebase";
import Topbar from "@/components/Topbar/Topbar";

type User = {
  displayName: string;
  solvedProblems: { problemID: string; timeTaken: number }[];
};

const Leaderboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRef = collection(firestore, "users");
        const querySnapshot = await getDocs(usersRef);

        const fetchedUsers: User[] = [];

        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          const user: User = {
            displayName: userData.displayName,
            solvedProblems: userData.solvedProblems || [],
          };
          fetchedUsers.push(user);
        });

        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchData();
  }, []);

  const calculateTotalTime = (user: User): number => {
    let totalTime = 0;
    if (user.solvedProblems) {
      user.solvedProblems.forEach((problem) => {
        totalTime += problem.timeTaken;
      });
    }
    return totalTime;
  };

  // Sort users based on total time
  const sortedUsers = [...users].sort(
    (a, b) => calculateTotalTime(a) - calculateTotalTime(b)
  );

  return (
    <>
      <Topbar />
      <div className="bg-dark-layer-2 min-h-screen py-8">
        <div className="bg-dark-layer-1 container mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">
            Leaderboard
          </h1>
          <table className="w-full border-collapse border border-gray-400">
            <thead>
              <tr>
                <th className="bg-dark-layer-2 text-white py-2 px-4">
                  Display Name
                </th>
                <th className="bg-dark-layer-2 text-white py-2 px-4">
                  Total Time (seconds)
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map((user, index) => (
                <tr
                  key={index}
                  className={
                    index % 2 === 0 ? "bg-dark-layer-1" : "bg-dark-layer-2"
                  }
                >
                  <td className="py-2 px-4 text-gray-200 text-center border border-gray-400">
                    {user.displayName}
                  </td>
                  <td className="py-2 px-4 text-gray-200 text-center border border-gray-400">
                    {calculateTotalTime(user)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Leaderboard;
