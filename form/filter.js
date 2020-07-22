let filteredBy = (form , filter)=>{
    let result = [];
    for (const answer of form.records){
        result.push(answer);
        for(const field of form.fields){
            if (!filter[field.name])
                continue;
            if (field.type === 'Number'){
                if (parseInt(answer.value) <= parseInt(filter[field.name].to) && parseInt(answer.value) >= parseInt(filter[field.name].from))
                    continue;
            }
            else if (field.type === 'Text'){
                if (answer.value.includes(filter[field.name]))
                    continue;
            }
            else if (field.type === 'Data'){
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