# Breaktime

Breaktime is a CLI app inspired by [Breaktime](http://breaktimeapp.com/). The app encourages you to take breaks from your work and device by locking your screen after a set time.

## Install

`npm i -g breaktime`

## Usage

`breaktime [amount unit] [-say]`

Running `breaktime` on your console will give you the default timer of 45 minutes. To set a custom timer, simply type it out after `breaktime`: e.g. `breaktime 20 minutes`. The app uses moment to parse the time, so most formats are supported.

The `-say` option will tell you when there are 5 seconds remaining using the built-in text-to-speech of your device.

## Examples

```sh
breaktime 45 minutes
breaktime 2 hours -say
breaktime 10 seconds
```

## Contributing

Feel free to submit an issue to bring up a bug or suggest an improvement, or to submit a pull request with your improvement implemented.
