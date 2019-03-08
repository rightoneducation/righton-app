import React from 'react';
import { Linking, Text } from 'react-native';

export default function renderHyperlinkedText(string, baseStyles = {}, linkStyles = {}, openLink) {
  if (typeof string !== 'string') return null;
  const httpRegex = /http/g;
  const wwwRegex = /www/g;
  const comRegex = /.com/g;
  const httpType = httpRegex.test(string);
  const wwwType = wwwRegex.test(string);
  const comIndices = getMatchedIndices(comRegex, string);
  if ((httpType || wwwType) && comIndices) {
    // Reset these regex indices because `comRegex` throws it off at its completion. 
    httpRegex.lastIndex = 0;
    wwwRegex.lastIndex = 0;
    const httpIndices = httpType ? 
      getMatchedIndices(httpRegex, string) :
      getMatchedIndices(wwwRegex, string);
    if (httpIndices.length === comIndices.length) {
      const result = [];
      let noLinkString = string.substring(0, httpIndices[0] || string.length);
      result.push(<Text key={noLinkString} style={baseStyles}>{ noLinkString }</Text>);
      for (let i = 0; i < httpIndices.length; i += 1) {
        const linkString = string.substring(httpIndices[i], comIndices[i] + 4);
        result.push(
          <Text
            key={linkString}
            style={[baseStyles, linkStyles]}
            onPress={openLink ? () => openLink(linkString) : () => Linking.openURL(linkString)}
          >
            { linkString }
          </Text>
        );
        noLinkString = string.substring(comIndices[i] + 4, httpIndices[i + 1] || string.length);
        if (noLinkString) {
          result.push(
            <Text key={noLinkString} style={baseStyles}>
              { noLinkString }
            </Text>
          );
        }
      }
      // Make sure the parent `<View>` container has a style of `flexWrap: 'wrap'`
      return result;
    }
  }
  return <Text style={baseStyles}>{ string }</Text>;
}

function getMatchedIndices(regex, text) {
  const result = [];
  let match;
  do {
    match = regex.exec(text);
    if (match) result.push(match.index);
  } while (match);
  return result;
}
