import supabase from "../config/supabaseClient";

export const getAllHousing = async () => {
  const { data, error } = await supabase.from("housing").select();
  if (error) {
    console.log("Error retrieving housing:", error)
  }
  return data;
}

export const getHousing = async (id) => {
  const { data, error } = await supabase.from("housing").select().eq("id", id)
  if (error) {
    console.log(`Error retrieving housing ${id}:`, error)
  }
  return data;
}

export const getInterestPoints = async () => {
  const { data, error } = await supabase.from("housing").select(
    `id,
    name,
    interestPoints (name)
  `)
  if (error) {
    console.log("Error retrieving pois:", error)
  }
  return data;
}

export const testTags = async () => {
  const { data, error } = await supabase.from("reviews").select(`
    "created_at",
    tags (
      name
    )
  `)
  return data;
}
