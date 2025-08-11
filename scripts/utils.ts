const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

export function createElementNSWithAttributes(elementName:string, attributes:Record<string,string> = {}):SVGElement {
        
        const element = document.createElementNS(SVG_NAMESPACE, elementName);
        
        Object.entries(attributes).forEach(([key, value]) => {
            element.setAttribute(key, value);        
        });
        return element;
}