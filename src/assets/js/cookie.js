var pluses = /\+/g

function parseCookieValue(s) {
  if (s.indexOf('"') === 0) {
    // This is a quoted cookie as according to RFC2068, unescape...
    s = s
      .slice(1, -1)
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, '\\')
  }

  try {
    // Replace server-side written pluses with spaces.
    // If we can't decode the cookie, ignore it, it's unusable.
    // If we can't parse the cookie, ignore it, it's unusable.
    s = decodeURIComponent(s.replace(pluses, ' '))
    return s
  } catch (e) {}
}

var cookie = function(key, value, options = {}) {
  // Write
  if (value !== undefined) {
    if (typeof options.expires === 'number') {
      var days = options.expires
      var t = (options.expires = new Date())
      t.setTime(+t + days * 864e5)
    }

    return (document.cookie = [
      encodeURIComponent(key),
      '=',
      encodeURIComponent(value),
      options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
      options.path ? '; path=' + options.path : '',
      options.domain ? '; domain=' + options.domain : '',
      options.secure ? '; secure' : ''
    ].join(''))
  }

  // Read
  var result = key ? undefined : {}

  // To prevent the for loop in the first place assign an empty array
  // in case there are no cookies at all. Also prevents odd result when
  // calling cookie().
  var cookies = document.cookie ? document.cookie.split('; ') : []

  for (var i = 0, l = cookies.length; i < l; i++) {
    var parts = cookies[i].split('=')
    var name = decodeURIComponent(parts.shift())
    var cookie = parts.join('=')

    if (key && key === name) {
      // If second argument (value) is a function it's a converter...
      result = parseCookieValue(cookie)
      break
    }

    // Prevent storing a cookie that we couldn't decode.
    if (!key && (cookie = parseCookieValue(cookie)) !== undefined) {
      result[name] = cookie
    }
  }

  return result
}

var removeCookie = function(key, options) {
  if (cookie(key) === undefined) {
    return false
  }

  // Must not alter options, thus extending a fresh object...
  cookie(
    key,
    '',
    Object.assign({}, options, {
      expires: -1
    })
  )
  return !cookie(key)
}

export { cookie, removeCookie }
