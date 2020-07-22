let filteredBy = (form , filter)=>{
    let result = [];
    for (const answer of form.records){
        result.push(answer);
        for(const field of form.fields){
            if (!filter[field.name])
                continue;
            if (!answer.value)
            {
                result.pop();
                break;
            }
            if (field.type === 'Number'){
                if (parseInt(answer.value) <= parseInt(filter[field.name].to) && parseInt(answer.value) >= parseInt(filter[field.name].from))
                    continue;
            }
            else if (field.type === 'Text'){
                let ok = false;
                for(const pat of filter[field.name])
                {
                    if (answer.value.includes(pat)){
                        ok = true;
                        break;
                    }
                };
                if (ok === true)
                    continue;
            }
            else if (field.type === 'Data'){
                let date = new Date(answer.value);
                let from = new Date(filter[field.name].from);
                let to = new Date(filter[field.name].to);
                if (parseInt(date.getTime()) <= parseInt(to.getTime()) && parseInt(date.getTime()) >= parseInt(from.getTime()))
                    continue;
            }
            else {
                continue;
            }
            result.pop();
            
        }
    }
    return result;
}


module.exports = filteredBy;