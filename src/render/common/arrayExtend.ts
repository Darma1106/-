export function arrayExtend(): void {
  Array.prototype.clean = function () {
    this.length = 0
  }

  Array.prototype.delete = function (index: number) {
    return this.splice(index, 1)[0]
  }
}
