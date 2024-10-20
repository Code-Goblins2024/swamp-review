import supabase from "../config/supabaseClient";

export const addReview = async (content, housing_id, uuid, tag_ids) => {
  const { data, error } = await supabase.from("reviews").insert(
    { content, housing_id, uuid }
  ).select()
  if (error) {
    console.log("Couldn't create review")
    throw error
  }

  if (tag_ids.length == 0) {
    return data
  }

  const review_id = data.id
  tag_ids.forEach(async (tag_id) => {
    error = await supabase.from("reviews_to_tags").insert(
      { review_id, tag_id }
    )
    if (error) {
      console.log("Couldn't create tag")
      throw error
    }
  })

  return data
}


