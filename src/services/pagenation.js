export const pagenate=({page=1,size=2} = {})=>{

if(!page || page<=0) page =1

if(!size || size<=0) size = 2

let skip = (page- 1)*size 

return {limit:size , skip }

}