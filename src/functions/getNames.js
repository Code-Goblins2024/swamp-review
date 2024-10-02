import supabase from "../conn/supabase";

export const getNames = async () => {
  const { data, error } = await supabase.from("test").select();
  if (error) {
    return [];
  }
  return data;
}
