def flatten_dict(d):
  for v in d.values():
    if isinstance(v, dict):
      yield from flatten_dict(v)
    else:
      yield v

def flatten_tuple(data):
    result = []
    for item in data:
        if isinstance(item, tuple):
            result.extend(flatten_tuple(item))
        else:
            result.append(item)
    return tuple(result)

def dict_to_list(data):
    data = flatten_dict(data)
    flatList = []
    for element in data:
        if(type(element) is tuple):    
            flattened = flatten_tuple(element)
            flatList += list(flattened)
        else:
            flatList.append(element)
    return flatList

