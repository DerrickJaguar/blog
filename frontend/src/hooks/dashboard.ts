import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";
import type { Tag } from "./blog";

interface trendingTagsAxios {
  msg: string;
  trendingTags: Tag[];
}

export function useTrendingTags() {
  const [trendingTags, setTrendingTags] = useState<string[]>([]);
  const [tagsLoading, setTagsLoading] = useState(true);

  useEffect(() => {
    const handleFetchingTrendingTags = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setTagsLoading(false);
          return;
        }
        
        const res = await axios.get<trendingTagsAxios>(
          `${BACKEND_URL}/api/v1/blog/tags/trend`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const tags = res.data.trendingTags.map((tag) => tag.name);
        setTrendingTags(tags);
      } catch (e) {
        console.error("Error:", e instanceof Error ? e.message : e);
      } finally {
        setTagsLoading(false);
      }
    };
    handleFetchingTrendingTags();
  }, []);
  return { trendingTags, tagsLoading };
}

interface newUsersBinds {
  id: string;
  name: string;
  bio: string;
  imageUrl: string;
  followedBack: boolean;
  followersCount: number;
  himself: boolean;
}
export function useNewUsers() {
  const [usersLoading, setUsersLoading] = useState(true);
  const [newUsers, setNewUsers] = useState<newUsersBinds[]>([]);

  useEffect(() => {
    const handleFetchingNewUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setUsersLoading(false);
          return;
        }
        
        const res = await axios.get(`${BACKEND_URL}/api/v1/user/bulk/new`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(res.data.msg);
        setNewUsers(res.data.users);
      } catch (e) {
        console.error("Error:", e instanceof Error ? e.message : e);
      } finally {
        setUsersLoading(false);
      }
    };
    handleFetchingNewUsers();
  }, []);
  return { usersLoading, newUsers };
}
