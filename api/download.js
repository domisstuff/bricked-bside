export default function handler(req,res){
  const key = req.query?.key
  if(!key || key !== "super_secret") return res.status(403).json({error:"forbidden"})
  res.status(200).json({data:saveddata || []})
}
