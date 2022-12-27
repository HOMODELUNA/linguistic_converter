
/**
 * SB语言有元组,但是没有元组字面量
 * 我还得自己造一个
 * @param args 
 * @returns 
 */
export const tuple = <T extends any[]>(...args: T): T => args

export function equally<T>(...arr:T[]):[T,number][]{
	const len = arr.length,average = 1/len
	return arr.map( (x)=>tuple(x,average) )
}


export function num_select<T>(num:number,arr:[T,number][]): T {
	var x = num
	for (const [v,p] of arr){
		if (x >=0 && x < p){
			return v;
		}
		x -= p
	}
	throw new Error(`it won't happen unless num > 1, found ${num}`)
}